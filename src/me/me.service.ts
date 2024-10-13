import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';

import Voucher from "src/vouchers/voucher.entity";
import VoucherUser from "src/vouchers/voucher-user.entity";
import { ICheckVoucherDto } from "./dto/meDto";
import Order from "src/orders/order.entity";

@Injectable()
export default class MeService {
  constructor(
    @InjectRepository(Voucher)
    private vouchersRepository: Repository<Voucher>,
    @InjectRepository(VoucherUser)
    private voucherUserRepository: Repository<VoucherUser>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>
  ) {}

  async getMyVouchers(user_id: number) {
    try {
      const vouchers = await this.voucherUserRepository
        .createQueryBuilder('voucher_user')
        .leftJoin('voucher_user.voucher', 'voucher')
        .addSelect([
          'voucher.code',
          'voucher.valid_from',
          'voucher.valid_to',
        ])
        .where('voucher_user.user_id = :user_id', { user_id })
        .getMany();

      return {
        data: vouchers,
        success: true,
        status: HttpStatus.OK
      }
    } catch (e) {
      throw new HttpException('Error Service ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  async checkVoucher(checkVoucherDto: ICheckVoucherDto, user_id: number) {
    try {
      const voucher = await this.vouchersRepository.findOne({
        where: {
          code: checkVoucherDto.voucher_code
        }
      });

      if (!voucher) {
        throw new HttpException('Voucher not found', HttpStatus.NOT_FOUND);
      }

      console.log('voucher', voucher.valid_from, new Date(voucher.valid_from) < new Date())
      console.log('voucher', voucher.valid_to, new Date(voucher.valid_to) > new Date())

      if (new Date(voucher.valid_from) > new Date() || new Date(voucher.valid_to) < new Date()) {
        console.log('1111111111')
        throw new HttpException('Voucher not valid', HttpStatus.BAD_REQUEST);
      }

      if (voucher.usage_limit < 0) {
        console.log('2222222222')
        throw new HttpException('Voucher not valid', HttpStatus.BAD_REQUEST);
      }

      const voucherUser = await this.voucherUserRepository.findOne({
        where: {
          user: {
            id: user_id
          },
          voucher: {
            id: voucher.id
          }}
      });

      if (!voucherUser) {
        throw new HttpException('Voucher not found', HttpStatus.NOT_FOUND);
      }

      if (voucherUser.usage_count > 2) {
        throw new HttpException('Voucher already used', HttpStatus.BAD_REQUEST);
      }

      return {
        data: voucher,
        success: true,
        status: HttpStatus.OK
      }
    } catch (e) {
      throw new HttpException('Error Service ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  async getMyOrders(user_id: number) {
    try {
      const orders = await this.orderRepository
        .createQueryBuilder('o')
        .leftJoinAndSelect('o.order_items', 'order_items')
        .leftJoinAndSelect('order_items.product', 'product')
        .where('o.buyer_info = :user_id', { user_id })
        .getMany();
      
      return {
        data: orders,
        success: true,
        status: HttpStatus.OK
      }
    } catch (e) {
      throw new HttpException('Error Service ' + e, HttpStatus.BAD_REQUEST);
    }
  }
}
