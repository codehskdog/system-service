import { DynamicModule, Global, Module } from '@nestjs/common';
import { NacosOptions, NacosService } from './nacos.service';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({})
export class NacosModule {
  static forRoot(options: NacosOptions): DynamicModule {
    return {
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['.env'],
          isGlobal: true,
        }),
      ],
      module: NacosModule,
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
        NacosService,
      ],
      exports: [NacosService],
    };
  }
}
