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
  Put,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import OrdersService from './orders.service';
import { CreateOrderDto, UpdateOrderDto } from './dto/createOrder.dto';
import { NotificationService } from 'src/notifications/notifications.service';

@Controller('orders')
export class OrderController {
  constructor(
    private ordersService: OrdersService,
    private notificationService: NotificationService
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createOrder(@Body() orderDto: CreateOrderDto, @Request() req: any) {
    return this.ordersService.createOrder(orderDto, Number(req.user.user_id));
  }

  @Post('/user')
  @UseGuards(AuthGuard('jwt'))
  async createOrderFromUser(@Body() orderDto: CreateOrderDto, @Request() req: any) {
    const { data } = await this.ordersService.createOrder(orderDto, Number(req.user.user_id));
    this.notificationService.createNotification({
      type: 'order',
      message: 'Order created successfully',
      is_read: false,
      url: '/dashboard/don-mua',
      data: data,
    },
    Number(req.user.user_id));
  }

  @Get()
  getOrders(@Request() req: any, @Query() query: any) {
    return this.ordersService.getOrders(query);
  }

  @Get('/report')
  getOrdersForReport() {
    return this.ordersService.getAllOrdersForReport();
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

  @Put(':id')
  updateOrder(@Param('id') id: string, @Body() orderDto: UpdateOrderDto) {
    return this.ordersService.updateOrder(id, orderDto);
  }
}
