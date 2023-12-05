import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Post from '../posts/post.entity';

@Entity()
class Category {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @ManyToMany(() => Post, (post: Post) => post.categories)
  @JoinTable()
  public posts: Post[];
}

export default Category;
