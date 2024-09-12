import { Body, Controller, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import VouchersService from "./vouchers.service";
import type { CreateVoucherDto, CreateVoucherUserDto, UpdateVoucherDto } from "./dto";
import { AuthGuard } from "@nestjs/passport";

@Controller('vouchers')
export default class VouchersController {
  constructor(
    private readonly vouchersService: VouchersService
  ) {}

  @Get()
  async getVouchers() {
    return this.vouchersService.getVouchers();
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
}
