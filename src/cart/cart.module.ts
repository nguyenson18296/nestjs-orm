import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import User from 'src/users/user.entity';
import Product from 'src/products/product.entity';
import { UsersService } from 'src/users/users.service';
import ProductsService from 'src/products/products.service';
import { CartItem } from './cart-item.entity';
import { CartItemService } from './cartItem.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, User, Product, CartItem])],
  providers: [CartService, UsersService, ProductsService, CartItemService],
  controllers: [CartController],
})
export class CartModule {}
