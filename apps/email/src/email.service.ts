import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';

export interface EmailOptions {
  subject: string;
  text?: string;
  html?: string;
}

@Injectable()
export class EmailService implements OnModuleInit {
  private transporter;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  private config;
  async onModuleInit() {
    const name = this.configService.get<string>('RUN_NAME');
    this.config = this.configService.get(`nacos_config_${name}`);
    this.transporter = createTransport(this.config.email);
  }
  sendEmail(data: EmailOptions) {
    this.transporter.sendMail({
      from: `"${this.config.email.name}" <${this.config.email.auth.user}>`,
      to: this.config.email.auth.user,
      ...data,
    });
  }
}
