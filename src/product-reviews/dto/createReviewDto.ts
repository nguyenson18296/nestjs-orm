export interface CreateReviewsProductDto {
  user_id: number;
  product_slug: string;
  content: string;
  parent_comment_id?: number;
}
