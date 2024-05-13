import {
  Get,
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Delete,
  Param,
  UseGuards,
  Put,
  Request,
} from '@nestjs/common';
import { CreateReviewsProductDto } from './dto/createReviewDto';
import { ProductReviewsService } from './product-reviews.service';
import { RolesGuard } from 'src/users/roles/roles.guard';
import { UpdateReviewDto } from './dto/updateReviewDto';
import { OptionalJwtAuthGuard } from 'src/auth/optional-jwt-auth.guard';

@Controller('product-reviews')
@UseGuards(RolesGuard)
export class ProductReviewsController {
  constructor(private readonly productReviewsService: ProductReviewsService) {}

  @Get(':product_id')
  @UseGuards(OptionalJwtAuthGuard)
  async getComments(
    @Param('product_id') product_id: string,
    @Request() req: any,
  ) {
    try {
      return this.productReviewsService.getAllProductReviews(
        Number(product_id),
        Number(req.user.user_id),
      );
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

  @Put(':id')
  async updateReview(
    @Param() { id }: { id: number },
    @Body() reviewDto: UpdateReviewDto,
  ) {
    return this.productReviewsService.updateComment(id, reviewDto);
  }

  @Delete(':id')
  // @Roles(Role.Admin)
  async deleteReview(@Param('id') id: number) {
    return this.productReviewsService.deleteComment(id);
  }
}
