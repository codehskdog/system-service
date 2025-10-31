import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { NacosService } from '@app/nacos';

@Injectable()
export class UserService implements OnApplicationBootstrap {
  private userClient: ClientProxy;

  @Inject(NacosService)
  private readonly nacosService: NacosService;
  async onApplicationBootstrap() {
    const res = await this.nacosService.getHealthInstance('user');
    if (!res.length) {
      throw new Error('user-service 服务未启动');
    }
    const instance = res[0];
    this.userClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: instance.ip,
        port: instance.port,
      },
    });
    await this.userClient.connect();
    Logger.log(`user-service 连接成功`);
  }

  create(createUserDto: CreateUserDto) {
    return this.userClient.send('user.registerByUserName', createUserDto);
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
