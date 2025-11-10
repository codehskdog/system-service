import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ClientService } from '@app/client';
import { USER_CLIENT } from '@app/client/model';

@Injectable()
export class UserService implements OnApplicationBootstrap {
  @Inject(ClientService)
  private readonly clientService: ClientService;
  async onApplicationBootstrap() {
    this.clientService.subUserClient();
  }

  create(createUserDto: CreateUserDto) {
    return this.clientService
      .getUserClient()
      .send(USER_CLIENT.CREATE_BY_USERNAME_PASSWORD, createUserDto);
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
