import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {

  @Inject(ConfigService)
  private configService: ConfigService;

  private client: RedisClientType;
  private readonly logger = new Logger(RedisService.name);

  async onModuleInit() {
    const name = this.configService.get('RUN_NAME');
    const config = this.configService.get(`nacos_config_${name}`);
    this.client = createClient(config.redis);
    await this.client.connect();
    this.logger.log('Redis服务启动成功')
    this.client.on('error', (err) => this.logger.error('Redis服务异常r', err));
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  get(key: string) {
    return this.client.get(key);
  }

  set(key: string, value: string, options?: { ttl: number }) {
    if (options?.ttl) {
      return this.client.setEx(key, options.ttl, value);
    }
    return this.client.set(key, value);
  }

  del(key: string) {
    return this.client.del(key);
  }

  getClient(): RedisClientType {
    return this.client;
  }

  // 按需添加更多方法...
}
