import { PrismaModel, PrismaService } from '@app/prisma';
import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import { Permission, Role } from '@prisma/client';
import { UserBusinessError } from './utils';
import { Status } from './code';
import { RES } from '@app/common';
import { ClientService } from '@app/client';
import { KAFKA_EMAIL_CLIENT } from '@app/client/model';

@Injectable()
export class UserService implements OnApplicationBootstrap {
  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  private emailClient: ClientKafka;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @Inject(ClientService)
  private readonly clientService: ClientService;

  async onApplicationBootstrap() {
    this.clientService.subKafkaClient();
  }

  createRole(role: Role) {
    return this.prismaService.role.create({
      data: role,
      select: {
        id: true,
      },
    });
  }

  updatePermission(
    permission: Pick<Permission, 'name' | 'id' | 'description'>,
  ) {
    return this.prismaService.permission.update({
      where: {
        id: permission.id,
      },
      data: permission,
    });
  }
  updateRole(
    role: Pick<Role, 'id' | 'name' | 'description'> & {
      permissionIds: string[];
    },
  ) {
    const { permissionIds, id, ...roleData } = role;
    return this.prismaService.role.update({
      where: {
        id: role.id,
      },
      data: {
        ...roleData,
        permissions: {
          set: permissionIds.map((permId) => ({ id: permId })),
        },
      },
    });
  }

  async createPermission(permission: Permission) {
    await this.prismaService.permission.create({
      data: permission,
      select: {
        id: true,
      },
    });
    return RES.Success;
  }

  async registerByUserName(username: string, password: string) {
    const hasUser = await this.prismaService.user.count({
      where: {
        username,
      },
    });
    if (hasUser) {
      throw new UserBusinessError(Status.HAD_CREATED_USER);
    }
    await this.prismaService.user.create({
      data: {
        username,
        password,
      },
    });
    this.clientService.getKafkaClient().emit(KAFKA_EMAIL_CLIENT.SEND_EMAIL, {
      subject: '注册成功',
      text: `用户名: ${username} 密码: ${password}`,
    });
    return RES.Success;
  }
  getHello(): string {
    return 'Hello World!';
  }
}
