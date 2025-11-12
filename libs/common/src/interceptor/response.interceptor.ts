import {
  BadGatewayException,
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  //   @Inject('BusinessOptions')
  //   private readonly businessOptions: {
  //     [key: number | string]: string;
  //   };
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const _data = typeof data === 'object' ? data : { data };
        if (!_data.code) {
          _data.code = 200;
        }
        const { code, error, message, ...res } = _data;

        return {
          code,
          error,
          message,
          data: res,
        };
      }),
    );
  }
}
