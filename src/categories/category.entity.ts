import Product from 'src/products/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Category {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column({ nullable: true })
  public slug: string;

  @Column({ nullable: true })
  public thumbnail: string;

  @OneToMany(() => Product, (product: Product) => product)
  public product: Product;
}

export default Category;
