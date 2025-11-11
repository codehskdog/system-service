import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '@app/redis';

@Module({
  imports: [JwtModule, RedisModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
