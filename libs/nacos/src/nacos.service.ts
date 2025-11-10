import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { NacosNamingClient } from 'nacos';
import { ConfigService } from '@nestjs/config';
interface Instance {
  instanceId: string;
  ip: string; //IP of instance
  port: number; //Port of instance
  healthy: boolean;
  enabled: boolean;
  serviceName?: string;
  weight?: number;
  ephemeral?: boolean;
  clusterName?: string;
}

export interface NacosOptions {
  serviceName: string; //Service name
  instance?: Partial<Instance>; //Instance
  groupName?: string;
  skipRegister?: boolean;
}

@Injectable()
export class NacosService implements OnApplicationBootstrap, OnModuleDestroy {
  @Inject('CONFIG_OPTIONS')
  private options: NacosOptions;

  @Inject(ConfigService)
  private configService: ConfigService;

  private readonly logger = new Logger(NacosService.name);
  private client: NacosNamingClient;

  private instance: Partial<Instance>; //Instance
  async onApplicationBootstrap() {
    const name = this.configService.get<string>('RUN_NAME');
    const config = this.configService.get(`nacos_config_${name}`);
    this.instance = config?.run || {};
    this.client = new NacosNamingClient({
      logger: {
        ...console,
        ...this.logger,
      },
      serverList: this.configService.get<string>('NACOS_SERVER'), // replace to real nacos serverList
      namespace: this.configService.get<string>('NACOS_NAMESPACE'),
      username: this.configService.get<string>('NACOS_SECRET_NAME'),
      password: this.configService.get<string>('NACOS_SECRET_PWD'),
    });
    await this.client.ready();
    if (!this.options.skipRegister) {
      await this.register();
    }

    this.logger.log('Nacos客户端准备就绪');
  }
  getClient(): NacosNamingClient {
    return this.client;
  }
  async getHealthInstance(dataId: string, groupName: string = 'DEFAULT_GROUP') {
    const list = await this.client.getAllInstances(dataId, groupName);
    return list.filter((item) => item.healthy);
  }
  async register() {
    await this.client.registerInstance(
      this.options.serviceName,
      // @ts-ignore
      {
        ...this.instance,
        ...this.options.instance,
      },
      this.options.groupName,
    );
  }
  async destroy() {
    if (!this.options.skipRegister) {
      await this.client.deregisterInstance(
        this.options.serviceName,
        // @ts-ignore
        { ...this.instance, ...this.options.instance },
        this.options.groupName,
      );
    }
  }

  async onModuleDestroy() {
    this.logger.log('Nacos客户端准备销毁');
    await this.destroy();
  }
}
