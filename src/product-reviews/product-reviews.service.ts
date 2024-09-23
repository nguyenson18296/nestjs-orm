import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import ProductReviews from './product-reviews.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateReviewsProductDto } from './dto/createReviewDto';
import { UpdateReviewDto } from './dto/updateReviewDto';
import User from 'src/users/user.entity';
import Product from 'src/products/product.entity';

@Injectable()
export class ProductReviewsService {
  constructor(
    @InjectRepository(ProductReviews)
    private reviewsRepository: Repository<ProductReviews>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async getAllProductReviews(product_slug: string, user_id?: number) {
    try {
      const response = await this.reviewsRepository
        .createQueryBuilder('review')
        .leftJoinAndSelect('review.user', 'user')
        .leftJoinAndSelect('review.replies', 'replies')
        .leftJoinAndSelect('replies.user', 'repliesUser')
        .leftJoin('review.product', 'product') // Properly joining the product table
        .where('product.slug = :slug', { slug: product_slug }) // Using the alias for product
        .andWhere('review.parent_comment IS NULL') // Assuming top-level reviews only
        .select([
          'review.id',
          'review.content',
          'review.created_at',
          'user.id',
          'user.username',
          'user.avatar',
          'replies.id',
          'replies.content',
          'replies.created_at',
          'repliesUser.id',
          'repliesUser.username',
          'repliesUser.avatar',
        ])
        .getMany();

      return {
        success: true,
        status: HttpStatus.OK,
        data: response.map((data) => ({
          ...data,
          is_mine: user_id ? data?.user.id === user_id : false,
          replies: (data.replies || []).map((rep) => ({
            ...rep,
            is_mine: data.user.id === user_id,
          })),
        })),
      };
    } catch (e) {
      throw new HttpException('Error ' + e, HttpStatus.BAD_REQUEST);
    }
  }

  async createComment({
    user_id,
    product_slug,
    content,
    parent_comment_id,
  }: CreateReviewsProductDto) {
    if (!content) {
      throw new HttpException('Content is required', HttpStatus.BAD_REQUEST);
    }
    // Verify user exists
    const userExists = await this.usersRepository.findOne({
      where: {
        id: user_id,
      },
    });
    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    // Verify product exists
    const productExists = await this.productsRepository.findOne({
      where: {
        slug: product_slug,
      },
    });
    if (!productExists) {
      throw new NotFoundException('Product not found');
    }

    let parentComment = null;
    if (parent_comment_id) {
      parentComment = await this.reviewsRepository.findOneBy({
        id: parent_comment_id,
      });
      if (!parentComment) {
        throw new HttpException('Error', HttpStatus.NOT_FOUND);
      }
    }

    const newComment = await this.reviewsRepository.create({
      content,
      parent_comment: parentComment,
      user: userExists,
      product: parent_comment_id ? null : productExists,
    });

    await this.reviewsRepository.save(newComment);
    return {
      success: true,
      status: HttpStatus.OK,
      data: {
        ...newComment,
      }
    };
  }

  async updateComment(comment_id: number, content: UpdateReviewDto) {
    try {
      const response = await this.reviewsRepository
        .createQueryBuilder()
        .update(ProductReviews)
        .set({ content: content.content })
        .where('id = :id', { id: comment_id })
        .execute();
      return {
        success: true,
        status: HttpStatus.OK,
        data: response,
      };
    } catch (e) {
      throw new HttpException('Error', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteComment(comment_id: number) {
    try {
      await this.reviewsRepository
        .createQueryBuilder()
        .delete()
        .from(ProductReviews)
        .where('id = :id', { id: comment_id })
        .execute();
      return {
        success: true,
        status: HttpStatus.OK,
      };
    } catch (e) {
      throw new HttpException('Error', HttpStatus.BAD_REQUEST);
    }
  }
}
