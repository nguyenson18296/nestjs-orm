import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import User from 'src/users/user.entity';
import Product from 'src/products/product.entity';

@Entity()
class ProductReviews {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public content: string;

  @OneToOne(() => User)
  public user: User;

  @ManyToOne(() => Product, (product) => product.comments)
  public product: Product;
}

export default ProductReviews;
