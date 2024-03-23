import { Cart } from '../cart.entity';

export interface ICreateCartDto {
  user_id: number;
  product_id: number;
  quantity: number;
}

export interface ICreateCartItemDto {
  cart: Cart;
  product_id: number;
  quantity: number;
}
