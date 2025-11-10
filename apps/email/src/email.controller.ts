import { Controller, Get } from '@nestjs/common';
import { EmailOptions, EmailService } from './email.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { KAFKA_EMAIL_CLIENT } from '@app/client/model';

@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @MessagePattern(KAFKA_EMAIL_CLIENT.SEND_EMAIL)
  sendEmail(@Payload() data: EmailOptions) {
    this.emailService.sendEmail(data);
  }
}
