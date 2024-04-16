export interface UpdatePostDto {
  content?: string;
  title?: string;
  short_description?: string;
  cover_photo?: string;
  seo_title?: string;
  seo_description?: string;
  tag_ids?: number[];
  // user?: User;
}
