import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

import User from 'src/users/user.entity';
import Product from 'src/products/product.entity';

@Entity()
class ProductReviews {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public content: string;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn()
  public user: User;

  @ManyToOne(() => Product, (product) => product.comments, {
    nullable: true,
  })
  @JoinColumn()
  public product: Product;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => ProductReviews, (comment) => comment.replies, {
    nullable: true,
  })
  parent_comment: ProductReviews;

  @OneToMany(() => ProductReviews, (comment) => comment.parent_comment)
  replies: ProductReviews[];

  can_delete?: boolean;
  can_edit?: boolean;
}

export default ProductReviews;
