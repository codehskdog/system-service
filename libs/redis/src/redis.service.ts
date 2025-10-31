import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly client: RedisClientType;
  private readonly logger = new Logger(RedisService.name);
  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL,
      password: process.env.REDIS_PASSWORD,
    });
  }

  async onModuleInit() {
    await this.client.connect();
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
