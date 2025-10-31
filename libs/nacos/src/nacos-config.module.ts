import { Module } from '@nestjs/common';
import { NacosConfigService } from './nacos-config.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
  ],
  providers: [NacosConfigService],
  exports: [NacosConfigService],
})
export class NacosConfigModule {}
