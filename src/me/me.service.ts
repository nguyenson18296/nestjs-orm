import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';

import Voucher from "src/vouchers/voucher.entity";
import VoucherUser from "src/vouchers/voucher-user.entity";
import { ICheckVoucherDto } from "./dto/meDto";

@Injectable()
export default class MeService {
  constructor(
    @InjectRepository(Voucher)
    private vouchersRepository: Repository<Voucher>,
    @InjectRepository(VoucherUser)
    private voucherUserRepository: Repository<VoucherUser>
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

      if (new Date(voucher.valid_from) > new Date() || new Date(voucher.valid_to) < new Date()) {
        throw new HttpException('Voucher not valid', HttpStatus.BAD_REQUEST);
      }

      if (voucher.usage_limit < 1) {
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
}