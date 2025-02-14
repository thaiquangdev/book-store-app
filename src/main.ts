import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // sử dụng interceptor cho toàn bộ ứng dụng
  app.useGlobalInterceptors(new ResponseInterceptor());

  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
