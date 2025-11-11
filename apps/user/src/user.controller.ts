import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDtoByUserName } from './dto/create-user.dto';
import { USER_CLIENT } from '@app/client/model';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(USER_CLIENT.CREATE_BY_USERNAME_PASSWORD)
  registerByUserName(@Payload() data: CreateUserDtoByUserName) {
    return this.userService.registerByUserName(data.username, data.password);
  }

  @MessagePattern(USER_CLIENT.LOGIN_BY_USERNAME_PASSWORD)
  loginByUserName(@Payload() data: CreateUserDtoByUserName) {
    return this.userService.loginByUserName(data.username, data.password);
  }

  @MessagePattern(USER_CLIENT.CHECK_TOKEN)
  checkToken(@Payload() token: string) {
    return this.userService.checkToken(token);
  }
}
