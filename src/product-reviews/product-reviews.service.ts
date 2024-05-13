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

  async getAllProductReviews(product_id: number, user_id: number) {
    try {
      const response = await this.reviewsRepository.find({
        where: {
          product: {
            id: product_id,
          },
        },
        relations: {
          user: true,
          replies: true,
        },
      });
      return {
        success: true,
        status: HttpStatus.OK,
        data: response.map((data) => ({
          ...data,
          is_mine: data.user.id === user_id,
          replies: data.replies.map((rep) => ({
            ...rep,
            is_mine: data.user.id === user_id,
          })),
        })),
      };
    } catch (e) {
      return {
        success: false,
        message: e,
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async createComment({
    user_id,
    product_id,
    content,
    parent_comment_id,
  }: CreateReviewsProductDto) {
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
        id: product_id,
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
      ...newComment,
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
