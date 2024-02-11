import {
  Controller,
  UploadedFile,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import ImagesService from './image.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('images')
export default class ImagesController {
  constructor(
    private readonly imagesService: ImagesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createImage(@UploadedFile() file: Express.Multer.File) {
    const result = await this.cloudinaryService.uploadFile(file);
    if (result) {
      const { asset_id, url } = result;
      return this.imagesService.createImage({
        id: asset_id,
        asset_id,
        url,
      });
    }
  }
}
