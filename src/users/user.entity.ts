import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import ProductReviews from '../product-reviews/product-reviews.entity';

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

  @OneToMany(() => ProductReviews, (comment) => comment.user)
  comments: Comment[];
}

export default User;
