import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/data-source';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { WishlistsModule } from './modules/wishlists/wishlists.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { CartsModule } from './modules/carts/carts.module';
import { AddressModule } from './modules/address/address.module';
import { CheckoutsModule } from './modules/checkouts/checkouts.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    AuthModule,
    MailModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
    WishlistsModule,
    ReviewsModule,
    CartsModule,
    AddressModule,
    CheckoutsModule,
  ],
})
export class AppModule {}
