import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { getPrismaErrorMessage } from './error.filter';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient {
  @Inject(ConfigService)
  private configService: ConfigService;

  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      const name = this.configService.get('RUN_NAME');
      const config = this.configService.get(`nacos_config_${name}`);
      const client = new PrismaClient({
        datasources: config.datasources,
      });
      Object.assign(this, client);
      await this.$connect();
    } catch (error) {
      this.logger.error(getPrismaErrorMessage(error.code, error.message));
    }
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
