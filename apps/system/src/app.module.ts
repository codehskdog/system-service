import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { NacosModule } from '@app/nacos';

@Module({
  imports: [
    NacosModule.forRoot({
      serviceName: 'system',
      instance: {
        ip: 'localhost',
        port: 3000,
      },
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
