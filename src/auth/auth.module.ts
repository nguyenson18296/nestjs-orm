import { Module } from '@nestjs/common';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import OrderServices from 'src/orders/orders.service';
import User from '../users/user.entity';
import Order from '../orders/order.entity';
import Product from '../products/product.entity';
import OrderItem from '../orders/orderItem.entity';
import { Cart } from '../cart/cart.entity';
import { CartItem } from '../cart/cart-item.entity';
import { JwtStrategy } from './jwt.strategy';
import VoucherUser from '../vouchers/voucher-user.entity';
import Voucher from '../vouchers/voucher.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Order,
      Product,
      OrderItem,
      Cart,
      CartItem,
      Voucher,
      VoucherUser,
    ]),
    JwtModule.register({
      global: true,
      secret: 'secret',
      signOptions: { expiresIn: '3600s' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    OrderServices,
    JwtService,
    JwtStrategy,
  ],
})
export class AuthModule {}
