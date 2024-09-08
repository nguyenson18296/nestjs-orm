import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/loginDto';
import { AuthGuard } from '@nestjs/passport';
import OrdersService from 'src/orders/orders.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly ordersService: OrdersService,
  ) {}

  @Post('login')
  async login(@Body() payload: LoginDto) {
    try {
      return this.authService.singIn(payload);
    } catch (e) {
      throw new HttpException('Error', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Request() req: any) {
    const email = req?.user?.email;
    return this.authService.getMe(email);
  }

  @Get('/me/orders')
  @UseGuards(AuthGuard('jwt'))
  getOrders(@Request() req: any) {
    return this.ordersService.getOrdersByUser(req.user.user_id);
  }
}
