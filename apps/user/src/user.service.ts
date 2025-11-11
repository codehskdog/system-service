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
import { hashPassword, UserBusinessError, verifyPassword } from './utils';
import { Status } from './code';
import { RES } from '@app/common';
import { ClientService } from '@app/client';
import { KAFKA_EMAIL_CLIENT } from '@app/client/model';
import { AuthService } from '@app/auth';

@Injectable()
export class UserService implements OnApplicationBootstrap {
  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  @Inject(AuthService)
  private readonly authService: AuthService;

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
    const { salt, hash } = hashPassword(password);
    await this.prismaService.user.create({
      data: {
        username,
        password: hash,
        salt,
      },
    });
    this.clientService.getKafkaClient()?.emit(KAFKA_EMAIL_CLIENT.SEND_EMAIL, {
      subject: '注册成功',
      text: `用户名: ${username} 密码: ${password}`,
    });
    return RES.Success;
  }
  async loginByUserName(username: string, d_password: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username,
      },
    });
    if (!user) {
      throw new UserBusinessError(Status.USER_NOT_FOUND);
    }
    const { salt, password } = user;
    if (!verifyPassword(d_password, salt, password)) {
      throw new UserBusinessError(Status.USER_PASSWORD_ERROR);
    }
    const jwt = await this.authService.getJwt({
      id: user.id,
      username: user.username,
    });
    return {
      ...jwt,
      username: user.username,
      name: user.name,
    };
  }

  async checkToken(token: string) {
    const data = await this.authService.checkToken(token);
    return data;
  }
  getHello(): string {
    return 'Hello World!';
  }
}
