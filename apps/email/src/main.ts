import { NestFactory } from '@nestjs/core';
import { EmailModule } from './email.module';
import { Logger } from '@nestjs/common';
import { NacosConfigService, NacosConfigModule } from '@app/nacos';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
async function bootstrap() {
  const configApp = await NestFactory.create(NacosConfigModule);
  await configApp.init();
  const isDev = process.env.DEV;
  const nacosConfigService =
    configApp.get<NacosConfigService>(NacosConfigService);
  const emailName = isDev
    ? 'email_one'
    : nacosConfigService.getLocalConfig('RUN_NAME');

  const res = await nacosConfigService.getConfig(emailName);

  if (!res) {
    throw new Error('邮件服务配置错误');
  }
  const configName = `nacos_config_${emailName}`;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    EmailModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: res.kafka.brokers,
        },
        consumer: {
          groupId: res.kafka.groupId,
        },
      },
    },
  );

  const configService = app.get<ConfigService>(ConfigService);
  configService.set(configName, res);
  await app.listen();
  Logger.log(`邮件服务已经启动`);
  await configApp.close();
}

bootstrap();
