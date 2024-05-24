import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import OrdersService from './orders.service';
import { CreateOrderDto } from './dto/createOrder.dto';

@Controller('orders')
export class OrderController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createOrder(@Body() orderDto: CreateOrderDto, @Request() req: any) {
    return this.ordersService.createOrder(orderDto, Number(req.user.user_id));
  }

  @Get()
  getOrders(@Request() req: any) {
    return this.ordersService.getOrders();
  }

  @Delete(':id')
  deleteOrder(@Param('id') id: string) {
    return this.ordersService.deleteOrder(id);
  }
}
