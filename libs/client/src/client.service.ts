import { NacosConfigService, NacosService } from '@app/nacos';
import {
  BadGatewayException,
  Inject,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import {
  ClientKafka,
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Host } from 'nacos';

@Injectable()
export class ClientService implements OnApplicationBootstrap {
  private userClient: ClientProxy;
  private kafkaClient: ClientKafka;

  @Inject(NacosService)
  private readonly nacosService: NacosService;

  @Inject(NacosConfigService)
  private readonly nacosConfigService: NacosConfigService;
  async onApplicationBootstrap() {}
  subUserClient() {
    this.nacosService.getClient().subscribe(
      {
        serviceName: 'user',
      },
      (hosts) => {
        this.registerUserClient(hosts.filter((item) => item.healthy));
      },
    );
  }
  subKafkaClient(topics?: string[]) {
    this.nacosConfigService.subscribe('kafka', (config) => {
      this.registerKafkaClient(config.brokers, topics);
    });
  }

  async registerUserClient(res: Host[]): Promise<ClientProxy> {
    if (!this.userClient) {
      if (!res.length) {
        throw new Error('user-service 服务未启动');
      }

      if (this.userClient) {
        const nowHost = (this.userClient as any).host;
        const nowPort = (this.userClient as any).port;
        if (
          res.find((item) => item.ip === nowHost && item.port === nowPort) &&
          (this.userClient as any).isConnected
        ) {
          return;
        }
      }

      const len = res.length - 1;
      const random = Math.floor(Math.random() * len);
      const instance = res[random];
      this.userClient = ClientProxyFactory.create({
        transport: Transport.TCP,
        options: {
          host: instance.ip,
          port: instance.port,
        },
      });
    }
    await this.userClient.connect();
  }
  async registerKafkaClient(brokers: string[], topics?: string[]) {
    const kafka = new ClientKafka({
      client: {
        brokers: brokers,
      },
      producer: {
        allowAutoTopicCreation: true,
      },
    });
    if (topics?.length) {
      kafka.subscribeToResponseOf(topics);
    }
    await kafka.connect();
    this.kafkaClient = kafka;
  }

  getUserClient() {
    if (!this.userClient || !(this.userClient as any).isConnected) {
      throw new BadGatewayException('user-service 服务未启动');
    }
    return this.userClient;
  }

  getKafkaClient() {
    return this.kafkaClient;
  }
}
