import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('user.registerByUserName')
  registerByUserName(@Payload() data: { username: string; password: string }) {
    return this.userService.registerByUserName(data.username, data.password);
  }
}
