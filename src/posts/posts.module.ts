import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import PostsController from './posts.controller';
import PostsService from './posts.service';
import Post from './post.entity';
import { SearchModule } from 'src/search/search.module';
import { UsersModule } from 'src/users/users.module';
import PostsSearchService from './postsSearch.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), SearchModule, UsersModule],
  controllers: [PostsController],
  providers: [PostsService, PostsSearchService],
})
export class PostsModule {}
