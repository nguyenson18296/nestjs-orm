import { Controller, Get, UseGuards, Request, Post, Body } from "@nestjs/common";
import MeService from "./me.service";
import { AuthGuard } from "@nestjs/passport";

import type { ICheckVoucherDto } from './dto/meDto';

@Controller('me')
export default class MeController {
  constructor(
    private readonly meService: MeService
  ) {}
  @Get('/vouchers')
  @UseGuards(AuthGuard('jwt'))
  getMyVouchers(@Request() req: any) {
    return this.meService.getMyVouchers(Number(req.user.user_id));
  }

  @Post('/check-voucher')
  @UseGuards(AuthGuard('jwt'))
  checkVoucher(@Body() checkVoucherDto: ICheckVoucherDto, @Request() req: any) {
    return this.meService.checkVoucher(checkVoucherDto, Number(req.user.user_id));
  }

  @Get('/orders')
  @UseGuards(AuthGuard('jwt'))
  getMyOrders(@Request() req: any) {
    return this.meService.getMyOrders(Number(req.user.user_id));
  }
}
