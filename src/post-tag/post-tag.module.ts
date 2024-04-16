import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostTag } from './post-tag.entity';
import PostTagsController from './post-tag.controller';
import PostTagService from './post-tag.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostTag])],
  controllers: [PostTagsController],
  providers: [PostTagService],
})
export default class PostTagModule {}
