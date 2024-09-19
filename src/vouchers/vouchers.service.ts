import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';

import Voucher from './voucher.entity';
import VoucherUser from './voucher-user.entity';
import { CreateVoucherDto, CreateVoucherUserDto, UpdateVoucherDto } from './dto';
import User from 'src/users/user.entity';

@Injectable()
export default class VouchersService {
  constructor(
    @InjectRepository(Voucher)
    private vouchersRepository: Repository<Voucher>,
    @InjectRepository(VoucherUser)
    private voucherUserRepository: Repository<VoucherUser>,
  ) {}

  async getVouchers(queries?: {
    page?: number;
    limit?: number;
  }) {
    // Default pagination values
    const limit = queries.limit ? parseInt(queries.limit.toString(), 10) : 10;
    const page = queries.page ? parseInt(queries.page.toString(), 10) : 1;
    const skip = (page - 1) * limit; // Calculate offset

    try {
      const [vouchers, count] = await this.vouchersRepository.findAndCount({
        take: limit,
        skip: skip,
      });
      return {
        data: vouchers,
        total: count,
        page: page,
        limit: limit,
        total_page: Math.ceil(count / limit),
        success: true,
        status: HttpStatus.OK,
      };
    } catch (e) {
      throw new HttpException('Error Service ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  async createVoucher(voucher: CreateVoucherDto) {
    try {
      const newVoucher = this.vouchersRepository.create(voucher);
      await this.vouchersRepository.save(voucher);
      return {
        data: newVoucher,
        success: true,
        status: HttpStatus.CREATED,
      };
    } catch (e) {
      throw new HttpException('Error Service ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  async createVoucherUser({ voucher_id, user_id, usage_count }: CreateVoucherUserDto) {
    return await this.voucherUserRepository.manager.transaction(async entityManager => {
      const voucher = await entityManager.findOne(Voucher, {
        where: {
          id: voucher_id,
        }
      });
      if (!voucher) {
        throw new HttpException('Voucher not found', HttpStatus.NOT_FOUND);
      }
      const user = await entityManager.findOne(User, {
        where: {
          id: user_id,
        }
      })
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const voucherUser = this.voucherUserRepository.create({
        voucher,
        user,
        usage_count: usage_count,
      });
      await entityManager.save(voucherUser);
      return {
        data: voucherUser,
        success: true,
        status: HttpStatus.CREATED,
      }
    })
  }

  async updateVoucher(id: string, updateVoucherDto: UpdateVoucherDto) {
    try {
      const updatedVoucher = await this.vouchersRepository.update(id, updateVoucherDto);
      if (updatedVoucher.affected === 0) {
        throw new HttpException('Voucher not found', HttpStatus.NOT_FOUND);
      }
      const updatedVoucherData = await this.vouchersRepository.findOne({
        where: {
          id,
        }
      });
      return {
        data: updatedVoucherData,
        success: true,
        status: HttpStatus.OK,
      };
    } catch (e) {
      throw new HttpException('Error Service ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteVoucher(id: string) {
    try {
      const deletedVoucher = await this.vouchersRepository.delete(id);
      if (deletedVoucher.affected === 0) {
        throw new HttpException('Voucher not found', HttpStatus.NOT_FOUND);
      }
      return {
        data: deletedVoucher,
        success: true,
        status: HttpStatus.OK,
      };
    } catch (e) {
      throw new HttpException('Error Service ' + e, HttpStatus.BAD_REQUEST);
    }
  }
}
