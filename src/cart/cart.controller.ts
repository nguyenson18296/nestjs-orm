import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';

import { ICreateCartDto } from './dto/createCartDto';
import { CartItemService } from './cartItem.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('cart')
export class CartController {
  constructor(
    private readonly cartsService: CartService,
    private readonly cartItemService: CartItemService,
  ) {}

  @Post('/add')
  @UseGuards(AuthGuard('jwt'))
  addToCart(
    @Body()
    { product_id, quantity }: ICreateCartDto,
    @Request() req: any,
  ) {
    try {
      return this.cartsService.addToCart(
        Number(req.user.user_id),
        product_id,
        quantity,
      );
    } catch (e) {
      throw new HttpException('Error', HttpStatus.BAD_GATEWAY);
    }
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getUserCart(@Request() req: any) {
    return this.cartsService.getUserCart(Number(req.user.user_id));
  }

  @Delete('/cart-item/:id')
  deleteCartItem(@Param('id') id: string) {
    return this.cartItemService.deleteProductInCart(Number(id));
  }
}
