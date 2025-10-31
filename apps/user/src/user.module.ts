import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { NacosModule } from '@app/nacos';
import { PrismaModule } from '@app/prisma';
import { RedisModule } from '@app/redis';

@Module({
  imports: [
    NacosModule.forRoot({
      serviceName: 'user',
    }),
    PrismaModule,
    RedisModule
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
