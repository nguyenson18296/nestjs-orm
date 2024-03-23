import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from './cart-item.entity';
import { Repository } from 'typeorm';
import { ICreateCartItemDto } from './dto/createCartDto';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
  ) {}

  async createCartItem(cartItem: ICreateCartItemDto) {
    try {
      return this.cartItemRepository.save(cartItem);
    } catch (e) {
      throw new HttpException('Can not find cart item', HttpStatus.NOT_FOUND);
    }
  }

  async deleteProductInCart(cartItemId: number) {
    try {
      const cartItem = await this.cartItemRepository.findOne({
        where: {
          id: cartItemId,
        },
      });
      if (!cartItem) {
        throw new HttpException('Error', HttpStatus.BAD_REQUEST);
      }
      await this.cartItemRepository
        .createQueryBuilder()
        .delete()
        .from(CartItem)
        .where('id = :id', { id: cartItemId })
        .execute();

      return {
        success: true,
        status: HttpStatus.OK,
      };
    } catch (e) {
      throw new HttpException('Error', HttpStatus.BAD_REQUEST);
    }
  }
}
