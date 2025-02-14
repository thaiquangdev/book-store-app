import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    const httpResponse = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((data) => ({
        statusCode: httpResponse.statusCode,
        message: 'Thành công',
        data,
      })),
    );
  }
}
