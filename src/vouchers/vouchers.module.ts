import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import Voucher from "./voucher.entity";
import VoucherProduct from "./voucher-product.entity";
import VouchersService from "./vouchers.service";
import VouchersController from "./vouchers.controller";
import VoucherUser from "./voucher-user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Voucher, VoucherUser, VoucherProduct])
  ],
  controllers: [
    VouchersController
  ],
  providers: [
    VouchersService
  ]
})
export class VouchersModule {}
