import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import PostEntity from './post.entity';
import PostNotFoundException from './exception/postNotFound.exception';
import User from 'src/users/user.entity';

@Injectable()
export default class PostsService {
  private lastPostId = 0;
  private posts: PostEntity[] = [];

  constructor(
    @InjectRepository(PostEntity)
    private postsRepository: Repository<PostEntity>,
  ) {}

  async getAllPosts() {
    return this.postsRepository.find({ relations: ['author', 'categories'] });
  }

  async getPostById(id: number) {
    const post = await this.postsRepository.findOne({
      where: {
        id,
      },
      relations: ['author', 'categories'],
    });
    if (post) {
      return post;
    }
    throw new PostNotFoundException(id);
  }

  async replacePost(id: number, post: UpdatePostDto) {
    await this.postsRepository.update(id, post);
    const updatedPost = await this.postsRepository.findOne({
      where: {
        id,
      },
      relations: ['author'],
    });
    if (updatedPost) {
      return updatedPost;
    }
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async createPost(post: CreatePostDto, user: User) {
    const newPost = await this.postsRepository.create({
      ...post,
      author: user,
    });
    await this.postsRepository.save(newPost);

    return {
      success: true,
      data: newPost,
    };
  }

  async deletePost(id: number) {
    const deletePost = await this.postsRepository.delete(id);
    if (!deletePost.affected) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
  }
}
