export interface CreateReviewsProductDto {
  user_id: number;
  product_id: number;
  content: string;
  parent_comment_id?: number;
}
