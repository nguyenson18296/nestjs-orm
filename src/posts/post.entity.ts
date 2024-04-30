import { PostTag } from 'src/post-tag/post-tag.entity';
import User from 'src/users/user.entity';
import { generateSlug } from 'src/utils/utils';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
class Post {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column('text', { nullable: true })
  short_description: string;

  @Column({ nullable: true })
  seo_title: string;

  @Column({ nullable: true })
  seo_description: string;

  @Column({ nullable: true })
  cover_photo: string;

  @Column({ unique: true })
  public slug: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column('text')
  public content: string;

  @ManyToMany(() => PostTag, (tag) => tag.posts, { nullable: true })
  @JoinTable()
  tags: PostTag[];

  @Column({ default: 0 })
  public priority: number;

  @Column({ default: false })
  public is_featured: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  updateSlug() {
    if (!this.slug) {
      this.slug = generateSlug(this.title);
    }
  }
}

export default Post;
