import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import ProductReviews from '../product-reviews/product-reviews.entity';
import { Role } from './roles/role.enum';
import { Notification } from 'src/notifications/notification.entity';
import Post from 'src/posts/post.entity';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
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

  @OneToMany(() => ProductReviews, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Post, (posts) => posts, { cascade: true })
  @JoinColumn()
  posts: Post[];

  @OneToMany(() => Notification, (notifications) => notifications.user)
  notifications: Notification[];
}

export default User;
