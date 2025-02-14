import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const method = request.method;
    const url = request.url;
    const start = Date.now();

    this.logger.log(`📥 [REQUEST] ${method} ${url}`);

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        this.logger.log(`📤 [RESPONSE] ${method} ${url} - ${duration}ms`);
      }),
    );
  }
}
