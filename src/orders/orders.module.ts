import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import Order from './order.entity';
import OrdersService from './orders.service';
import { OrderController } from './orders.controller';
import ProductsService from '../products/products.service';
import { NotificationService } from '../notifications/notifications.service';
import Product from '../products/product.entity';
import { Notification } from '../notifications/notification.entity';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import OrderItem from './orderItem.entity';
import User from '../users/user.entity';
import { Cart } from '../cart/cart.entity';
import { CartItem } from '../cart/cart-item.entity';
import VoucherUser from '../vouchers/voucher-user.entity';
import Voucher from '../vouchers/voucher.entity';

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
      VoucherUser,
      Voucher
    ]),
  ],
  controllers: [OrderController],
  providers: [OrdersService, ProductsService, NotificationService, NotificationsGateway],
})
export class OrderModules {}
