import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UnNeedAuth } from '../guard/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UnNeedAuth()
  @Post()
  create(@Body() createUserDto: any) {
    return this.userService.create(createUserDto);
  }

  @UnNeedAuth()
  @Post('login')
  loginByUserName(@Body() data: any) {
    return this.userService.loginByUserName(data);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
