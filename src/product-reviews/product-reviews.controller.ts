import {
  Get,
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CreateReviewsProductDto } from './dto/createReviewDto';
import { ProductReviewsService } from './product-reviews.service';

@Controller('product-reviews')
export class ProductReviewsController {
  constructor(private readonly productReviewsService: ProductReviewsService) {}

  @Get()
  async getComments() {
    try {
      return this.productReviewsService.getAllCategories();
    } catch (e) {
      throw new HttpException('Error', HttpStatus.BAD_REQUEST);
    }
  }

  @Post()
  async createReview(@Body() comment: CreateReviewsProductDto) {
    try {
      return this.productReviewsService.createComment({
        user_id: comment.user_id,
        product_id: comment.product_id,
        content: comment.content,
        parent_comment_id: comment.parent_comment_id,
      });
    } catch (e) {
      throw new HttpException('Error', HttpStatus.BAD_REQUEST);
    }
  }
}
