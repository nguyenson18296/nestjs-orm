import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreatePostDto } from './dto/createPost.dto';
import Post from './post.entity';
import { UpdatePostDto } from './dto/updatePost.dto';
import User from '../users/user.entity';
import { generateSlug } from 'src/utils/utils';

@Injectable()
export default class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getAllPosts(queries? : {
    page?: number;
    limit?: number
  }) {
    const limit = queries.limit ? parseInt(queries.limit.toString(), 10) : 10;
    const page = queries.page ? parseInt(queries.page.toString(), 10) : 1;
    const skip = (page - 1) * limit; // Calculate offset

    try {
      const [posts, count] = await this.postsRepository.findAndCount({
        relations: {
          user: true,
        },
        select: ['id', 'title', 'slug', 'post_type', 'cover_photo', 'seo_description', 'created_at'],
        take: limit,
        skip: skip,
      });
      return {
        data: posts,
        total: count,
        page: page,
        limit: limit,
        total_page: Math.ceil(count / limit),
        success: true,
        status: HttpStatus.OK,
      };
    } catch (e) {
      throw new HttpException('Error Service ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  async getAllPostsByUser(user_id?: number, user_name?: string) {
    try {
      interface WhereConditions {
        user?: {
          id?: number;
          username?: string;
        };
      }
      // Build the query conditionally based on provided parameters
      const user = await this.usersRepository.findOne({
        where: {
          username: user_name,
        },
      });
      const whereConditions: WhereConditions = {};
      if (user_id) {
        whereConditions['user'] = {
          ...whereConditions['user'],
          id: user_id,
        };
      }
      if (user_name) {
        whereConditions['user'] = {
          ...whereConditions['user'],
          username: user_name,
        };
      }
      const posts = await this.postsRepository.find({
        where: whereConditions,
        relations: {
          user: true,
        },
      });
      return {
        user,
        data: posts,
        success: true,
        status: HttpStatus.OK,
      };
    } catch (e) {
      throw new HttpException('Error Service ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  async getRandomPosts(offset: number) {
    try {
      const result = await this.postsRepository
        .createQueryBuilder('post')
        .orderBy('RANDOM()')
        .offset(offset)
        .limit(12)
        .getMany();

      return {
        data: result,
        success: true,
        status: HttpStatus.OK,
      };
    } catch (e) {
      return {
        data: null as any,
        success: false,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async getPostBySlug(slug: string) {
    const post = await this.postsRepository.findOne({
      where: {
        slug,
      },
      relations: {
        user: true,
      },
    });
    if (post) {
      return {
        data: post,
        success: true,
        status: HttpStatus.OK,
      };
    }
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async createPost(post: CreatePostDto, user_id: number) {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          id: user_id,
        },
      });
      post.slug = generateSlug(post.title);
      const newPost = await this.postsRepository.create({
        ...post,
        slug: post.slug,
        user,
      });
      await this.postsRepository.save(newPost);
      return {
        data: newPost,
        status: HttpStatus.CREATED,
        success: true,
      };
    } catch (e) {
      throw new HttpException(
        'Error Service ' + e.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updatePost(id: number, post: UpdatePostDto) {
    try {
      const updatedResult = await this.postsRepository.update(id, post);
      if (updatedResult.affected === 0) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      const updatedPost = await this.postsRepository.findOneBy({ id });
      return {
        success: true,
        data: updatedPost,
        status: HttpStatus.OK,
      };
    } catch (e) {
      throw new HttpException('Error Service ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  async deletePost(id: number) {
    const deleteResponse = await this.postsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
    };
  }
}
