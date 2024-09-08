import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  Query,
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
  getOrders(@Request() req: any, @Query() query: any) {
    return this.ordersService.getOrders(query);
  }

  @Get('user/:id')
  getOrdersByUser(@Param('id') id: string) {
    console.log('id', id);
    return this.ordersService.getOrdersByUser(+id);
  }

  @Delete(':id')
  deleteOrder(@Param('id') id: string) {
    return this.ordersService.deleteOrder(id);
  }
}
