import { Global, Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { NacosConfigModule, NacosModule } from '@app/nacos';

@Global()
@Module({
  imports: [
    NacosConfigModule,
    NacosModule.forRoot({
      serviceName: 'nest-client-service',
      skipRegister: true,
    }),
  ],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientModule {}
