import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import Product from 'src/products/product.entity';

@Entity()
class Category {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column({ nullable: true })
  public orders: number;

  @Column({ nullable: true })
  public slug: string;

  @Column({ nullable: true })
  public thumbnail: string;

  @Column({ nullable: true })
  public description: string;

  @OneToMany(() => Product, (product: Product) => product.category, { cascade: true })
  @JoinColumn()
  public products: Product[];
}

export default Category;
