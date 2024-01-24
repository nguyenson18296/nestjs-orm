import { Module } from '@nestjs/common';

import { UploadController } from './upload.controller';
import { CloudStorageService } from 'src/core/Services/cloud-storage.service';

@Module({
  controllers: [UploadController],
  providers: [CloudStorageService],
})
export class UploadModule {}
