import { Injectable, NotFoundException } from '@nestjs/common';
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

  async createComment(
    userId: number,
    productId: number,
    comment: CreateReviewsProductDto,
  ) {
    // Verify user exists
    const userExists = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    // Verify product exists
    const productExists = await this.productsRepository.findOne({
      where: {
        id: productId,
      },
    });
    if (!productExists) {
      throw new NotFoundException('Product not found');
    }

    const newComment = await this.reviewsRepository.create({
      ...comment,
      user: userExists,
      product: productExists,
    });
    await this.reviewsRepository.save(newComment);
    return newComment;
  }
}
