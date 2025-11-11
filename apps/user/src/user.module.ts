import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { NacosModule } from '@app/nacos';
import { PrismaModule } from '@app/prisma';
import { RedisModule } from '@app/redis';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorFilter, ResponseInterceptor } from '@app/common';
import { ClientModule } from '@app/client';
import { AuthModule } from '@app/auth';

@Module({
  imports: [
    NacosModule.forRoot({
      serviceName: 'user',
    }),
    PrismaModule,
    RedisModule,
    ClientModule,
    AuthModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: ResponseInterceptor,
    // },
  ],
})
export class UserModule {}
