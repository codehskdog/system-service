import { RedisService } from '@app/redis';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

export interface AuthOptions {}

@Injectable()
export class AuthService {
  @Inject()
  private readonly configService: ConfigService;

  @Inject(RedisService)
  private readonly redisService: RedisService;

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  async genJwt(payload: any, options: JwtSignOptions = {}) {
    const secret = this.configService.get('jwt.secret');
    const expiresIn = this.configService.get('jwt.expiresIn');

    const jwt = await this.jwtService.sign(payload, {
      secret,
      expiresIn,
      ...options,
    });
    await this.redisService.set(jwt, JSON.stringify(payload), {
      ttl: expiresIn,
    });
    return {
      token: jwt,
      expiresIn,
    };
  }
  getJwt(payload: any) {
    return this.genJwt(payload);
  }

  async checkToken(token: string) {
    return await this.redisService.get(token);
  }
}
