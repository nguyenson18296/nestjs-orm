import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductReviewsController } from './product-reviews.controller';
import { ProductReviewsService } from './product-reviews.service';
import ProductReviews from './product-reviews.entity';
import ProductsService from 'src/products/products.service';
import { UsersService } from 'src/users/users.service';
import User from '../users/user.entity';
import Product from '../products/product.entity';
import Order from 'src/orders/order.entity';
import OrderItem from 'src/orders/orderItem.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductReviews, User, Product, Order, OrderItem]),
  ],
  controllers: [ProductReviewsController],
  providers: [ProductReviewsService, UsersService, ProductsService],
})
export class ProductReviewsModule {}
