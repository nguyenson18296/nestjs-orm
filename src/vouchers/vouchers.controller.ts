import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import VouchersService from "./vouchers.service";
import type { CreateVoucherDto, CreateVoucherUserDto, UpdateVoucherDto } from "./dto";
import { AuthGuard } from "@nestjs/passport";

@Controller('vouchers')
export default class VouchersController {
  constructor(
    private readonly vouchersService: VouchersService
  ) {}

  @Get()
  async getVouchers(@Query() queries?: {
    page?: number;
    limit?: number
  }) {
    return this.vouchersService.getVouchers({
      page: queries.page || 1,
      limit: queries.limit || 10
    });
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createVoucher(
    @Body() voucher: CreateVoucherDto
  ) {
    return this.vouchersService.createVoucher(voucher);
  }

  @Post('/users')
  async createVoucherUser(
    @Body() voucher: CreateVoucherUserDto
  ) {
    return this.vouchersService.createVoucherUser(voucher);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateVoucher(
    @Param() { id }: { id: string },
    @Body() voucher: UpdateVoucherDto
  ) {
    return this.vouchersService.updateVoucher(id, voucher);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteVoucher(
    @Param() { id }: { id: string }
  ) {
    return this.vouchersService.deleteVoucher(id);
  }
}
