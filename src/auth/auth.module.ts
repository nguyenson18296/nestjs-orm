import { Module } from '@nestjs/common';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import OrderServices from 'src/orders/orders.service';
import User from 'src/users/user.entity';
import Order from 'src/orders/order.entity';
import Product from 'src/products/product.entity';
import OrderItem from 'src/orders/orderItem.entity';
import { Cart } from 'src/cart/cart.entity';
import { CartItem } from 'src/cart/cart-item.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import VoucherUser from 'src/vouchers/voucher-user.entity';
import Voucher from 'src/vouchers/voucher.entity';

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
