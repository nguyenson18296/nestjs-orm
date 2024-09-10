import {
  IsNull,
  Not,
  Repository,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import Order, { TPaymentStatus } from './order.entity';
import { CreateOrderDto, UpdateOrderDto } from './dto/createOrder.dto';
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
    private cartItemsRepository: Repository<CartItem>,
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
        order.issued_date = new Date(orderDto.issued_date);
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

  async getOrders(queries?: {
    limit: number;
    page: number;
    from: string;
    to: string;
    payment_status: TPaymentStatus;
  }) {
    try {
      let whereConditions = [];

        // Default pagination values
        const limit = queries.limit ? parseInt(queries.limit.toString(), 10) : 10;
        const page = queries.page ? parseInt(queries.page.toString(), 10) : 1;

        // Validate if numbers are valid after parsing
        if (isNaN(limit) || isNaN(page) || limit <= 0 || page <= 0) {
            throw new HttpException('Pagination parameters must be valid numbers.', HttpStatus.BAD_REQUEST);
        }

        // Date filters
        if (queries.from) {
            const parsedStartDate = new Date(queries.from);
            if (!isNaN(parsedStartDate.getTime())) {
              console.log('parsedStartDate', parsedStartDate)
                whereConditions.push({ created_at: MoreThanOrEqual(parsedStartDate) });
            }
        }

        if (queries.to) {
            const parsedEndDate = new Date(queries.to);
            parsedEndDate.setHours(23, 59, 59, 999); // Set to the end of the day
            if (!isNaN(parsedEndDate.getTime())) {
                whereConditions.push({ created_at: LessThanOrEqual(parsedEndDate) });
            }
        }

        if (queries.payment_status) {
            whereConditions.push({ payment_status: queries.payment_status });
        }

        const skip = (page - 1) * limit; // Calculate offset

        const orders = await this.ordersRepository.findAndCount({
            relations: ['order_items', 'order_items.product', 'buyer_info'],
            where: whereConditions,
            take: limit,
            skip: skip,
        });
        const [data, count] = orders;
        return {
            data,
            total: count,
            success: true,
            page,
            limit,
            status: HttpStatus.OK,
        };
    } catch (e) {
      throw new HttpException('Error: ' + e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getAllOrdersForReport() {
    try {
      const [orders, count] = await this.ordersRepository.findAndCount({
        relations: ['order_items', 'order_items.product', 'buyer_info'],
      });
      return {
        data: orders,
        total: count,
        success: true,
        status: HttpStatus.OK,
      };
    } catch (e) {
      throw new HttpException('Error: ' + e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getOrdersByUser(user_id: number) {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          id: user_id,
        },
        relations: ['orders', 'orders.order_items', 'orders.order_items.product'],
      });
      return {
        data: user.orders,
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

  async updateOrder(order_id: string, updateOrderDto: UpdateOrderDto) {
    try {
      const order = await this.ordersRepository.findOne({
        where: {
          id: order_id,
        },
        relations: ['order_items', 'order_items.product'],
      });
      if (!order) {
        throw new Error(`Order with ID ${order_id} not found`);
      }

      if (updateOrderDto.payment_status) {
        order.payment_status = updateOrderDto.payment_status;
      }

      if (updateOrderDto.issued_date) {
        order.issued_date = updateOrderDto.issued_date;
      }

      if (updateOrderDto.buyer_info) {
        const user = await this.usersRepository.findOne({
          where: {
            id: updateOrderDto.buyer_info,
          },
        });
        if (!user) {
          throw new Error(`User with ID ${updateOrderDto.buyer_info} not found`);
        }
        order.buyer_info = user;
      }

      if (updateOrderDto.contact_detail) {
        order.contact_detail = updateOrderDto.contact_detail;
      }

      await this.ordersRepository.save(order);
      return {
        data: order,
        success: true,
        status: HttpStatus.OK,
      };
    } catch (e) {
      throw new HttpException('Error: ' + e.message, HttpStatus.BAD_REQUEST);
    }
  }
}
