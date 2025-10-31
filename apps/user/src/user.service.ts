import { PrismaService } from '@app/prisma';
import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class UserService implements OnApplicationBootstrap {
  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  private emailClient: ClientKafka;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  async onApplicationBootstrap() {
    const name = this.configService.get<string>('RUN_NAME');
    const config = this.configService.get(`nacos_config_${name}`);
    this.emailClient = new ClientKafka({
      client: {
        brokers: config.kafka.brokers,
      },
      producer: {
        allowAutoTopicCreation: true,
      },
    });

    await this.emailClient.connect();
    Logger.log(`email-service 连接成功`);
  }

  async registerByUserName(username: string, password: string) {
    const res = await this.prismaService.user.create({
      data: {
        username,
        password,
      },
    });
    this.emailClient.emit('sendEmail', {
      subject: '注册成功',
      text: `用户名: ${username} 密码: ${password}`,
    });
    return res;
  }
  getHello(): string {
    return 'Hello World!';
  }
}
