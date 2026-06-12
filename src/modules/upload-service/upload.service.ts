import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  v2 as cloudinary,
  type DeleteApiResponse,
  type TransformationOptions,
  type UploadApiResponse,
} from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('cloudinary.cloudName'),
      api_key: this.configService.get<string>('cloudinary.apiKey'),
      api_secret: this.configService.get<string>('cloudinary.apiSecret'),
    });
  }

  async uploadImage(file: Express.Multer.File, folder?: string): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder || 'uploads',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            reject(new Error(error.message || 'Upload failed'));
          } else {
            resolve(result as UploadApiResponse);
          }
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  async deleteImage(publicId: string): Promise<DeleteApiResponse> {
    return (await cloudinary.uploader.destroy(publicId)) as DeleteApiResponse;
  }

  getOptimizedUrl(publicId: string, options?: TransformationOptions): string {
    const urlOptions: Record<string, unknown> = {
      fetch_format: 'auto',
      quality: 'auto',
    };
    if (options) {
      Object.assign(urlOptions, options);
    }
    const url = cloudinary.url(publicId, urlOptions as TransformationOptions);
    return url ?? '';
  }

  getTransformedUrl(
    publicId: string,
    options?: {
      width?: number;
      height?: number;
      crop?: string;
      gravity?: string;
    },
  ): string {
    const url = cloudinary.url(publicId, {
      fetch_format: 'auto',
      quality: 'auto',
      ...options,
    });
    return url || '';
  }
}
