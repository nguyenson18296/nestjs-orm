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
  JoinColumn,
} from 'typeorm';

import Category from '../categories/category.entity';
import { generateSlug } from '../utils/utils';
import ProductReviews from '../product-reviews/product-reviews.entity';
import VoucherProduct from '../vouchers/voucher-product.entity';

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

  @Column('simple-array', { nullable: true })
  public images: string[] | string;

  @Column({ nullable: true })
  short_description: string;

  @Column()
  public description: string;

  @Column('numeric', {
    nullable: true,
  })
  public price: string;

  @Column('numeric', { nullable: true })
  public discount_price: string;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  public category: Category;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('integer', { default: 0 })
  public in_stock: number;

  @Column('integer', { default: 5 })
  public rating: number;

  @OneToMany(() => VoucherProduct, (voucher) => voucher.product)
  public vouchers: VoucherProduct[];

  @OneToMany(() => ProductReviews, (comments) => comments.product)
  public comments: ProductReviews[];

  @BeforeInsert()
  @BeforeUpdate()
  updateSlug() {
    this.slug = generateSlug(this.title);
  }
}

export default Product;
