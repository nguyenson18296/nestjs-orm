import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { Repository } from 'typeorm';
import Product from 'src/products/product.entity';
import User from 'src/users/user.entity';
import { CartItem } from './cart-item.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartsRepository: Repository<Cart>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
  ) {}

  async createCartForUser(userId: number) {
    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }
    const cart = new Cart();
    cart.user = user;
    cart.items = [];

    await this.cartsRepository.save(cart);
    return cart;
  }

  async addToCart(userId: number, productId: number, quantity: number) {
    let cart = await this.cartsRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      cart = await this.createCartForUser(userId);
    }

    const product = await this.productsRepository.findOneBy({ id: productId });
    if (!product) {
      throw new Error('Product not found');
    }

    let cartItem = cart.items.find((item) => item.product.id === productId);
    if (cartItem) {
      cartItem.quantity += quantity;
      await this.cartItemRepository.save(cartItem);
    } else {
      cartItem = new CartItem();
      cartItem.cart = cart;
      cartItem.product = product;
      cartItem.quantity = quantity;
      cart.items.push(cartItem);
      await this.cartItemRepository.save(cartItem);
    }
    await this.cartsRepository.save(cart);
    return {
      success: true,
      status: HttpStatus.OK,
      // data: cart,
    }
  }

  async getUserCart(userId: number) {
    try {
      const cart = await this.cartsRepository.findOne({
        where: {
          user: {
            id: userId,
          },
        },
        relations: {
          items: {
            product: true,
          },
        },
      });
      return {
        success: true,
        status: HttpStatus.OK,
        data: cart ?? ([] as any),
        // eslint-disable-next-line prettier/prettier
        }
    } catch (e) {
      throw new HttpException('Error', HttpStatus.BAD_REQUEST);
    }
  }
}
