import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import Category from 'src/categories/category.entity';
import { generateSlug } from 'src/utils/utils';
import ProductReviews from 'src/product-reviews/product-reviews.entity';

@Entity()
class Product {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column({ nullable: true, unique: true })
  public slug: string;

  @Column({ nullable: true })
  public thumbnail: string;

  @Column({ nullable: true, array: true })
  public images: string;

  @Column()
  public description: string;

  @Column('numeric', {
    nullable: true,
  })
  public price: string;

  @Column('numeric', { nullable: true })
  public discount_price: string;

  @ManyToOne(() => Category, (category) => category.products)
  public category: Category;

  @ManyToOne(() => Category)
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => ProductReviews, (comments) => comments.product)
  public comments: ProductReviews[];

  @BeforeInsert()
  @BeforeUpdate()
  updateSlug() {
    this.slug = generateSlug(this.title);
  }
}

export default Product;
