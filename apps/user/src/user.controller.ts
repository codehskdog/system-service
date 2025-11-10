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
}
