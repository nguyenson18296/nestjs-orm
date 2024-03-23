import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CartService } from './cart.service';

import { ICreateCartDto } from './dto/createCartDto';
import { CartItemService } from './cartItem.service';

@Controller('cart')
export class CartController {
  constructor(
    private readonly cartsService: CartService,
    private readonly cartItemService: CartItemService,
  ) {}

  @Post('/add')
  addToCart(
    @Body()
    { user_id, product_id, quantity }: ICreateCartDto,
  ) {
    try {
      return this.cartsService.addToCart(user_id, product_id, quantity);
    } catch (e) {
      throw new HttpException('Error', HttpStatus.BAD_GATEWAY);
    }
  }

  @Get(':id')
  getUserCart(@Param('id') id: string) {
    return this.cartsService.getUserCart(Number(id));
  }

  @Delete('/cart-item/:id')
  deleteCartItem(@Param('id') id: string) {
    return this.cartItemService.deleteProductInCart(Number(id));
  }
}
