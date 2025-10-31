import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { NacosModule } from '@app/nacos';
@Module({
  imports: [
    NacosModule.forRoot({
      serviceName: 'email',
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
