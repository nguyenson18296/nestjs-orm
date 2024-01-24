import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ nullable: true })
  public price: string;

  @Column({ nullable: true })
  public discount_price: string;
}

export default Product;
