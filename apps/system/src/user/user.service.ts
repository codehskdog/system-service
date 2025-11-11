import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';
import { ClientService } from '@app/client';
import { USER_CLIENT } from '@app/client/model';

@Injectable()
export class UserService implements OnApplicationBootstrap {
  @Inject(ClientService)
  private readonly clientService: ClientService;
  async onApplicationBootstrap() {
    this.clientService.subUserClient();
  }

  create(createUserDto: any) {
    return this.clientService
      .getUserClient()
      .send(USER_CLIENT.CREATE_BY_USERNAME_PASSWORD, createUserDto);
  }

  loginByUserName(data: any) {
    return this.clientService
      .getUserClient()
      .send(USER_CLIENT.LOGIN_BY_USERNAME_PASSWORD, data);
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: any) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  checkToken(token: string) {
    return this.clientService
      .getUserClient()
      .send(USER_CLIENT.CHECK_TOKEN, token);
  }
}
