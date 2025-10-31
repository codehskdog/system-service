import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { getPrismaErrorMessage } from './error.filter';

@Injectable()
export class PrismaService extends PrismaClient {
  private readonly logger = new Logger(PrismaService.name);
  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      this.logger.error(getPrismaErrorMessage(error.code, error.message));
    }
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
