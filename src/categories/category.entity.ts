import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}

export default Category;
