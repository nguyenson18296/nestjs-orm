import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostTag } from './post-tag.entity';
import { Repository } from 'typeorm';

import { ICreatePostTagDto } from './dto/createPostTagDto';

@Injectable()
export default class PostTagService {
  constructor(
    @InjectRepository(PostTag)
    private postTagRepository: Repository<PostTag>,
  ) {}

  async getAllTags() {
    try {
      const data = await this.postTagRepository.find();
      return {
        data,
        success: true,
        status: HttpStatus.OK,
      };
    } catch (e) {
      throw new HttpException('Error' + e, HttpStatus.BAD_REQUEST)
    }
  }

  async create(body: ICreatePostTagDto): Promise<{
    data: PostTag;
    success: boolean;
    status: HttpStatus;
  }> {
    const tag = await this.postTagRepository.create(body);
    await this.postTagRepository.save(tag);

    return {
      data: tag,
      success: true,
      status: HttpStatus.OK,
    };
  }
}
