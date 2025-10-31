import { Controller, Get } from '@nestjs/common';
import { EmailOptions, EmailService } from './email.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @MessagePattern('sendEmail')
  sendEmail(@Payload() data: EmailOptions) {
    this.emailService.sendEmail(data);
  }
}
