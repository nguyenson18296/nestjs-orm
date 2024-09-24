import User from '../../users/user.entity';

export class CreatePostDto {
  content: string;
  title: string;
  short_description: string;
  cover_photo: string;
  seo_title: string;
  seo_description: string;
  tag_ids: number[];
  slug: string;
  user: User;
}
