// @app/common/filters/error.filter.ts
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Inject,
  Injectable,
  RpcExceptionFilter,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, of } from 'rxjs'; // 导入 of 方法（用于创建 Observable）
import { ResponseError } from '../response';

const getError = (exception: unknown) => {
  const error = new ResponseError(400, '');
  // 处理 RpcException
  if (exception instanceof RpcException) {
    const _error = exception.getError();
    if (typeof _error === 'string') {
      error.message = _error;
    } else {
      // @ts-ignore
      const message = _error?.message;
      if (message) {
        error.message = message;
      }

      // @ts-ignore
      const code = _error?.code || _error?.statusCode;
      if (code) {
        error.code = code;
      }
    }
  } else if (exception instanceof BadRequestException) {
    const res = exception.getResponse();
    if (typeof res === 'string') {
      error.message = res;
    } else {
      // @ts-ignore
      const message = res?.message;
      if (message) {
        // @ts-ignore
        error.message = message;
      }
      // @ts-ignore
      const code = res?.code || res?.statusCode;
      if (code) {
        error.code = code;
      }
    }
  }
  // 处理原生 Error
  else if (exception instanceof Error) {
    error.message = exception.message;
  }
  // 未知异常
  else {
    error.code = 500;
    error.message = '服务器内部错误';
  }
  return error;
};

@Catch()
@Injectable()
export class ErrorFilter implements RpcExceptionFilter {
  // ❶ 明确返回类型为 Observable<any>
  catch(exception: unknown, host: ArgumentsHost): Observable<any> {
    const error = getError(exception);
    return of(error);
  }
}

@Catch()
@Injectable()
export class NormalErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const error = getError(exception);
    const status = Number(error.code) > 10000 ? HttpStatus.OK : error.code;
    // @ts-ignore
    response.status(status).json(error);
  }
}

export class BusinessError extends RpcException {
  constructor(
    STATUS_MESSAGE: Record<number, string>,
    code: number | string,
    message?: string,
  ) {
    const msg = message || STATUS_MESSAGE[code];
    super({ code, message: msg });
  }
}
