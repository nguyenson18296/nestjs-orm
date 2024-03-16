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

  getAllCategories() {
    return this.reviewsRepository.find();
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
      product: productExists,
    });

    await this.reviewsRepository.save(newComment);
    return newComment;
  }
}
