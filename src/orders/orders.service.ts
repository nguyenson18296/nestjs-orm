import { IsNull, Not, Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import Order from './order.entity';
import { CreateOrderDto } from './dto/createOrder.dto';
import Product from 'src/products/product.entity';
import OrderItem from './orderItem.entity';
import User from 'src/users/user.entity';
import { Cart } from 'src/cart/cart.entity';
import { CartItem } from 'src/cart/cart-item.entity';

@Injectable()
export default class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemsRepository: Repository<CartItem>
  ) {}

  private async generateOrderNumber(): Promise<string> {
    const prefix = 'ORD_';
    const latestOrd = await this.ordersRepository.findOne({
      order: { order_number: 'DESC' },
      where: { order_number: Not(IsNull()) },
    });
    if (latestOrd) {
      const latestNumber =
        parseInt(latestOrd.order_number.replace(prefix, '')) + 1;
      return `${prefix}${latestNumber}`;
    } else {
      return `${prefix}1000`;
    }
  }

  async createOrder(orderDto: CreateOrderDto, user_id: number) {
    try {
      const order = new Order();
      order.order_items = []; // Initialize the orderItems array
      order.payment_status = orderDto.payment_status;

      const user = await this.usersRepository.findOne({
        where: {
          id: user_id,
        },
      });
      if (!user) {
        throw new Error(`User with ID ${user_id} not found`);
      }

      for (const { id, quantity } of orderDto.line_items) {
        const product = await this.productsRepository.findOneBy({ id });
        if (!product) {
          throw new Error(`Product with ID ${id} not found`);
        }

        const orderItem = new OrderItem();
        orderItem.product = product;
        orderItem.quantity = quantity;
        order.order_items.push(orderItem); // Add the order item to the Order
        order.total_price = order.order_items.reduce(
          (acc, item) =>
            acc + Number(item.product.discount_price) * item.quantity,
          0,
        );
        order.order_number = orderDto.order_number;
        order.issued_date = orderDto.issued_date;
        order.buyer_info = user;
        if (!orderDto.order_number) {
          order.order_number = await this.generateOrderNumber();
        }
      }

      await this.ordersRepository.save(order); // Save the order along with its items due to cascading
      const data = this.ordersRepository.findOne({
        where: { id: order.id },
        relations: ['order_items', 'order_items.product'],
      });
      const userCart = await this.cartRepository.findOne({
        where: {
          user: {
            id: user_id,
          },
        },
        relations: ['items'],
      });
      await this.cartItemsRepository.remove(userCart.items);
      await this.cartRepository.remove(userCart);
      return {
        data,
        success: true,
        status: HttpStatus.OK,
      };
    } catch (e) {
      throw new HttpException('Error: ' + e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getOrders() {
    try {
      const orders = await this.ordersRepository.findAndCount({
        relations: ['order_items', 'order_items.product', 'buyer_info'],
      });
      const [data, count] = orders;
      return {
        data,
        total: count,
        success: true,
        status: HttpStatus.OK,
      };
    } catch (e) {
      throw new HttpException('Error: ' + e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteOrder(order_id: string) {
    try {
      await this.orderItemsRepository
        .createQueryBuilder()
        .delete()
        .from(Order)
        .where('id = :id', { id: order_id })
        .execute();
    } catch (e) {
      throw new HttpException('Error: ' + e.message, HttpStatus.BAD_REQUEST);
    }
  }
}
