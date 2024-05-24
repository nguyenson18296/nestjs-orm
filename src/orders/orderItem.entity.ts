import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import Order from './order.entity';
import Product from 'src/products/product.entity';

@Entity()
class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.order_items)
  order: Order;

  @ManyToOne(() => Product)
  product: Product;

  @Column()
  quantity: number;
}

export default OrderItem;
