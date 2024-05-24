import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import Order from './order.entity';
import OrdersService from './orders.service';
import { OrderController } from './orders.controller';
import ProductsService from 'src/products/products.service';
import Product from 'src/products/product.entity';
import OrderItem from './orderItem.entity';
import User from 'src/users/user.entity';
import { Cart } from 'src/cart/cart.entity';
import { CartItem } from 'src/cart/cart-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Product, OrderItem, User, Cart, CartItem]),
  ],
  controllers: [OrderController],
  providers: [OrdersService, ProductsService],
})
export class OrderModules {}
