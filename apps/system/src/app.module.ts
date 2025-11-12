import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { UserModule } from './user/user.module';
import { NacosModule } from '@app/nacos';
// import { RoleModule } from './role/role.module';
import { Client } from '@nestjs/microservices';
import { ClientModule } from '@app/client';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import {
  ErrorFilter,
  NormalErrorFilter,
  ResponseInterceptor,
} from '@app/common';
import { AuthGuard } from './guard/auth.guard';
import { UserService } from './user/user.service';
@Module({
  imports: [
    NacosModule.forRoot({
      serviceName: 'system',
      instance: {
        ip: 'localhost',
        port: 3000,
      },
    }),
    ClientModule,
    UserModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: NormalErrorFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
