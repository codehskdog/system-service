import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NacosConfigClient } from 'nacos';

export interface ConfigOptions {
  defaultConfigList: string[];
}

@Injectable()
export class NacosConfigService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NacosConfigService.name);
  private client: NacosConfigClient;

  @Inject()
  private configService: ConfigService;

  constructor() {}

  async onModuleInit() {
    try {
      this.client = new NacosConfigClient({
        serverAddr: this.configService.get<string>('NACOS_SERVER'),
        namespace: this.configService.get<string>('NACOS_NAMESPACE'),
        username: this.configService.get<string>('NACOS_SECRET_NAME'),
        password: this.configService.get<string>('NACOS_SECRET_PWD'),
      });

      this.logger.log('Nacos配置客户端初始化成功');
    } catch (error) {
      this.logger.error('Nacos配置客户端初始化失败', error);
    }
  }

  async onModuleDestroy() {
    await this.client.close();
  }
  async close() {
    await this.client.close();
  }
  async getConfig(dataId: string, group = 'DEFAULT_GROUP') {
    const _dataId = `naocs_config_${dataId}`;
    if (this.configService.get(_dataId)) {
      return await this.configService.get(_dataId);
    }
    const config = this.parseConfig(
      await this.client.getConfig(dataId, group),
      'json',
    );
    this.configService.set(_dataId, config);
    return config;
  }

  /**
   * 解析配置内容
   */
  private parseConfig(content: string, type: string): any {
    try {
      if (type === 'json') {
        return JSON.parse(content);
      } else if (type === 'yaml' || type === 'yml') {
        // 简单的YAML解析，实际项目中可以使用js-yaml等库
        const config = {};
        content.split('\n').forEach((line) => {
          const parts = line.split(':').map((part) => part.trim());
          if (parts.length >= 2) {
            config[parts[0]] = parts.slice(1).join(':');
          }
        });
        return config;
      } else if (type === 'properties') {
        const config = {};
        content.split('\n').forEach((line) => {
          const parts = line.split('=').map((part) => part.trim());
          if (parts.length >= 2) {
            config[parts[0]] = parts.slice(1).join('=');
          }
        });
        return config;
      }
      return content;
    } catch (error) {
      this.logger.error('配置解析失败', error);
      return content;
    }
  }

  getLocalConfig(dataId: string) {
    return this.configService.get(dataId);
  }
  subscribe(dataId: string, callback: Function, group = 'DEFAULT_GROUP') {
    return this.client.subscribe(
      {
        dataId,
        group,
      },
      (config) => {
        callback(this.parseConfig(config, 'json'));
      },
    );
  }
}
