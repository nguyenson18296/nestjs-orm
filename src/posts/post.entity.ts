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

import { PostTag } from '../post-tag/post-tag.entity';
import User from '../users/user.entity';
import { generateSlug } from '../utils/utils';

export enum PostType {
  NORMAL = 'normal',
  HEADLINE = 'headline',
  FIRST_HEADLINE = 'first_headline',
  SECOND_HEADLINE = 'second_headline',
}

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

  @Column({ default: PostType.NORMAL })
  public post_type: PostType;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
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
