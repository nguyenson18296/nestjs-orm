import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Type } from 'class-transformer';

import User from 'src/users/user.entity';
import { ValidateNested } from 'class-validator';
import OrderItem from './orderItem.entity';

export type TPaymentStatus = 'PENDING' | 'COMPLETED' | 'CANCELED';

class ContactDetail {
  address: string;
  first_name: string;
  last_name: string;
  phone: string;
}

@Entity()
class Order {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ unique: true })
  order_number: string;

  @Column()
  issued_date: string;

  @ManyToMany(() => OrderItem, (order_items) => order_items.order, {
    cascade: ['insert', 'update'],
  })
  @JoinTable()
  order_items: OrderItem[];

  @Column()
  total_price: number;

  @ManyToOne(() => User, (user) => user)
  @JoinTable()
  buyer_info: User;

  @Column()
  payment_status: TPaymentStatus;

  @Type(() => ContactDetail)
  @ValidateNested()
  contact_detail: ContactDetail;

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true })
  full_name: string;

  @Column({ nullable: true })
  address: string;
}

export default Order;
