import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import Order from './order.entity';
import OrdersService from './orders.service';
import { OrderController } from './orders.controller';
import ProductsService from 'src/products/products.service';
import { NotificationService } from 'src/notifications/notifications.service';
import Product from 'src/products/product.entity';
import { Notification } from 'src/notifications/notification.entity';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import OrderItem from './orderItem.entity';
import User from 'src/users/user.entity';
import { Cart } from 'src/cart/cart.entity';
import { CartItem } from 'src/cart/cart-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      Product,
      OrderItem,
      User,
      Cart,
      CartItem,
      Notification,
    ]),
  ],
  controllers: [OrderController],
  providers: [OrdersService, ProductsService, NotificationService, NotificationsGateway],
})
export class OrderModules {}
