import { Module } from '@nestjs/common';
import { GoogleCloudStorageService } from './google-cloud-storage.service';

@Module({
  providers: [GoogleCloudStorageService],
  exports: [GoogleCloudStorageService],
})
export class GoogleCloudStorageModule {}
