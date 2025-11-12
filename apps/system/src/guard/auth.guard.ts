import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { UserService } from '../user/user.service';
import { Reflector } from '@nestjs/core';

export const UnNeedAuth = () => SetMetadata('un-need-auth', true);
export const useAuthGuard = () => UseGuards(AuthGuard);

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject(UserService)
  private readonly userService: UserService;

  @Inject(Reflector)
  private readonly reflector: Reflector;
  async canActivate(context: ExecutionContext) {
    const unNeed = this.reflector.get<Boolean>(
      'un-need-auth',
      context.getHandler(),
    );
    if (unNeed === true) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers?.authorization;
    if (this.userService && token) {
      const jwt = await lastValueFrom(this.userService.checkToken(token));
      if (jwt) {
        request.user = jwt;
        return true;
      }
    }
    throw new ForbiddenException('登陆失效');
  }
}
