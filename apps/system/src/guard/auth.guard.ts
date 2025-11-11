import { RedisService } from '@app/redis';
import {
  BadGatewayException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { lastValueFrom, Observable } from 'rxjs';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject(UserService)
  private readonly userService: UserService;
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    if (this.userService) {
      const jwt = await lastValueFrom(this.userService.checkToken(token));
      if (jwt) {
        request.user = jwt;
        return true;
      }
    }
    throw new ForbiddenException('登陆失效');
  }
}
