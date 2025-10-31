import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { NacosModule } from '@app/nacos';
import { PrismaModule } from '@app/prisma';

@Module({
  imports: [
    NacosModule.forRoot({
      serviceName: 'user',
    }),
    PrismaModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
