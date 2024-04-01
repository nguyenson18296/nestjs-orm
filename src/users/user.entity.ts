import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import ProductReviews from '../product-reviews/product-reviews.entity';
import { Role } from './roles/role.enum';
import { Notification } from 'src/notifications/notification.entity';

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

  @OneToMany(() => Notification, (notifications) => notifications.user)
  notifications: Notification[];
}

export default User;
