import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import VoucherUser from 'src/vouchers/voucher-user.entity';
import MeController from './me.controller';
import MeService from './me.service';
import Voucher from 'src/vouchers/voucher.entity';
import Order from 'src/orders/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VoucherUser, Voucher, Order])],
  controllers: [MeController],
  providers: [MeService],
})
export class MeModule {}
