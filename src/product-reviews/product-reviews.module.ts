import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductReviewsController } from './product-reviews.controller';
import { ProductReviewsService } from './product-reviews.service';
import ProductReviews from './product-reviews.entity';
import ProductsService from 'src/products/products.service';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductReviews])],
  controllers: [ProductReviewsController],
  providers: [ProductReviewsService, UsersService, ProductsService],
})
export class ProductReviewsModule {}
