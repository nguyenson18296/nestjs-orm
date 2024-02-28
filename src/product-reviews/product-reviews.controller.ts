import {
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

  @Post()
  async createReview(
    userId: number,
    productId: number,
    @Body() comment: CreateReviewsProductDto,
  ) {
    try {
      return this.productReviewsService.createComment(
        userId,
        productId,
        comment,
      );
    } catch (e) {
      throw new HttpException('Error', HttpStatus.BAD_REQUEST);
    }
  }
}
