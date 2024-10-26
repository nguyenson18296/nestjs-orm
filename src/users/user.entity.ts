import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsEmail, IsBoolean } from 'class-validator';

import ProductReviews from '../product-reviews/product-reviews.entity';
import { Role } from './roles/role.enum';
import { Notification } from '../notifications/notification.entity';
import Post from '../posts/post.entity';
import Order from '../orders/order.entity';
import VoucherUser from '../vouchers/voucher-user.entity';
import Tasks from 'src/tasks/task.entity';
import { Activity } from 'src/activities/activity.entity';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ default: false })
  @IsBoolean()
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

  @ManyToMany(() => Tasks, (tasks) => tasks.assignees)
  tasks: Tasks[];

  @OneToMany(() => ProductReviews, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => VoucherUser, (voucher) => voucher.user)
  vouchers: VoucherUser[];

  @OneToMany(() => Post, (posts) => posts, { cascade: true })
  @JoinColumn()
  posts: Post[];

  @OneToMany(() => Notification, (notifications) => notifications.user)
  notifications: Notification[];

  @OneToMany(() => Activity, (activity) => activity.user)
  activities: Activity[];

  // toJSON() {
  //   return instanceToPlain(this);
  // }
}

export default User;
