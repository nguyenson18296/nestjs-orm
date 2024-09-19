import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { instanceToPlain, Exclude } from 'class-transformer';

import ProductReviews from '../product-reviews/product-reviews.entity';
import { Role } from './roles/role.enum';
import { Notification } from 'src/notifications/notification.entity';
import Post from 'src/posts/post.entity';
import Order from 'src/orders/order.entity';
import VoucherUser from 'src/vouchers/voucher-user.entity';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ default: false })
  email_confirm: boolean;

  @Column({ nullable: true })
  avatar: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  role: Role;

  @OneToMany(() => Order, (orders) => orders.buyer_info)
  orders: Order[];

  @OneToMany(() => ProductReviews, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => VoucherUser, (voucher) => voucher.user)
  vouchers: VoucherUser[];

  @OneToMany(() => Post, (posts) => posts, { cascade: true })
  @JoinColumn()
  posts: Post[];

  @OneToMany(() => Notification, (notifications) => notifications.user)
  notifications: Notification[];

  toJSON() {
    return instanceToPlain(this);
  }
}

export default User;
