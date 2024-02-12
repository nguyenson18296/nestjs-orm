import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import Image from './image.entity';
import { CreateImageDto } from './dto/createImage.dto';

@Injectable()
export default class ImagesService {
  constructor(
    @InjectRepository(Image)
    private imagesRepository: Repository<Image>,
  ) {}

  async createImage(image: CreateImageDto) {
    const newImage = await this.imagesRepository.create(image);
    await this.imagesRepository.save(newImage);
    return newImage;
  }
}
