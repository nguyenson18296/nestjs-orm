import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Category {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column()
  public slug: string;

  @Column()
  public thumbnail: string;
}

export default Category;
