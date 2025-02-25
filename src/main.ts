import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // sử dụng interceptor cho toàn bộ ứng dụng
  app.useGlobalInterceptors(new ResponseInterceptor());

  app.useGlobalInterceptors(new LoggingInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Bookstore API')
    .setDescription('API for managing books, orders, and users in a bookstore')
    .setVersion('1.0')
    .addTag('users')
    .addTag('auth')
    .addTag('categories')
    .addTag('products')
    .addTag('reviews')
    .addTag('wishlists')
    .addTag('carts')
    .addTag('checkouts')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
