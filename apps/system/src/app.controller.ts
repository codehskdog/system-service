import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { UnNeedAuth } from './guard/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UnNeedAuth()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
