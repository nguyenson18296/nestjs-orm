// cloudinary.provider.ts

import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return cloudinary.config({
      cloud_name: 'dou7jklnk',
      api_key: '466789388693552',
      api_secret: 'P3vuMUKBeCC7UFshmVQL4omwkKg',
    });
  },
};
