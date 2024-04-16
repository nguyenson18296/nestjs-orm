import { Body, Controller, Get, Post } from '@nestjs/common';
import PostTagService from './post-tag.service';

import { ICreatePostTagDto } from './dto/createPostTagDto';

@Controller('post-tags')
export default class PostTagsController {
  constructor(private readonly postTagsService: PostTagService) {}

  @Get()
  getAllTags() {
    return this.postTagsService.getAllTags();
  }

  @Post()
  async createPostTag(@Body() tag: ICreatePostTagDto) {
    return this.postTagsService.create(tag);
  }
}
