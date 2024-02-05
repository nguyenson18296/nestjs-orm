import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Category from 'src/categories/category.entity';

@Entity()
class Product {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column({ nullable: true })
  public slug: string;

  @Column({ nullable: true })
  public thumbnail: string;

  @Column()
  public description: string;

  @Column('numeric', {
    nullable: true,
  })
  public price: string;

  @Column('numeric', { nullable: true })
  public discount_price: string;

  @ManyToOne(() => Category)
  @JoinColumn()
  public category: Category;
}

export default Product;
