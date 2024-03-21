import { CreateReviewsProductDto } from './createReviewDto';

export type UpdateReviewDto = Pick<CreateReviewsProductDto, 'content'>;
