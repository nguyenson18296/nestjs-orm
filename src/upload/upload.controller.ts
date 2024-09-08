import {
  Post,
  Controller,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, MulterModule } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

MulterModule.register({
  dest: '../../uploads',
});

@Controller('uploads')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      return 'No files uploaded';
    }

    try {
      // Handle each file and collect the URLs
      const uploadPromises = files.map(file => this.cloudinaryService.uploadFile(file));
      const urls = await Promise.all(uploadPromises);

      return { urls }; // Return the array of image URLs
    } catch (error) {
      console.error('Error uploading files:', error);
      return 'Failed to upload files';
    }
  }
}
