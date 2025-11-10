import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

@Catch(Error)
export class ErrorFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    // @ts-ignore
    const status = exception?.getStatus();

    // @ts-ignore
    response.status(HttpStatus.OK).json({
      // statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
