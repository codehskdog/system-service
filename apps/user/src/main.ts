import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { NacosConfigModule, NacosConfigService } from '@app/nacos';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import {
  BadRequestException,
  HttpStatus,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const configApp = await NestFactory.create(NacosConfigModule);
  await configApp.init();
  const isDev = process.env.DEV;
  const nacosConfigService =
    configApp.get<NacosConfigService>(NacosConfigService);
  const name = isDev
    ? 'user_one'
    : nacosConfigService.getLocalConfig('RUN_NAME');

  const res = await nacosConfigService.getConfig(name);
  await nacosConfigService.close();
  if (!res.run) {
    throw new Error('用户服务配置错误');
  }
  const configName = `nacos_config_${name}`;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      transport: Transport.TCP,
      options: {
        host: res.run.ip,
        port: res.run.port,
      },
    },
  );
  const configService = app.get<ConfigService>(ConfigService);
  configService.set(configName, res);
  configService.set('jwt', res?.jwt);
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      exceptionFactory(errors) {
        return new BadRequestException(
          {
            code: 10001,
            message: Object.values(errors[0].constraints)[0],
          },
          'Unprocessable Entity', // 状态码描述
        );
      },
    }),
  );
  await app.listen();
  Logger.log(`用户服务已经启动`);
  await configApp.close();
}
bootstrap();
