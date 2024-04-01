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
} from '@nestjs/common';
import { CreateReviewsProductDto } from './dto/createReviewDto';
import { ProductReviewsService } from './product-reviews.service';
// import { Roles } from 'src/users/roles/roles.decorator';
// import { Role } from 'src/users/roles/role.enum';
import { RolesGuard } from 'src/users/roles/roles.guard';
import { UpdateReviewDto } from './dto/updateReviewDto';

@Controller('product-reviews')
@UseGuards(RolesGuard)
export class ProductReviewsController {
  constructor(private readonly productReviewsService: ProductReviewsService) {}

  @Get()
  async getComments() {
    try {
      return this.productReviewsService.getAllProductReviews();
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
