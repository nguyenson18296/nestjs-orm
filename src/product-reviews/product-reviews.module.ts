import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductReviewsController } from './product-reviews.controller';
import { ProductReviewsService } from './product-reviews.service';
import ProductReviews from './product-reviews.entity';
import ProductsService from 'src/products/products.service';
import { UsersService } from 'src/users/users.service';
import User from 'src/users/user.entity';
import Product from 'src/products/product.entity';
import { NotificationService } from 'src/notifications/notifications.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductReviews, User, Product])],
  controllers: [ProductReviewsController],
  providers: [ProductReviewsService, UsersService, ProductsService],
})
export class ProductReviewsModule {}
