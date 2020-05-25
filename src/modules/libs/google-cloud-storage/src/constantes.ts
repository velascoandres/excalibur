/*
This file is part of Aginix: https://github.com/Aginix
Full project source: https://github.com/Aginix/nestjs-gcloud-storage
License: https://github.com/Aginix/nestjs-gcloud-storage/blob/master/LICENSE

Copyright 2020 by Sam Aginix (https://github.com/Aginix).
All rights reserved.
Permission is granted for use, copying, modification, and
distribution of modified versions of this work as long as this
notice is included.
 */
import {GoogleCloudStorageService} from './google-cloud-storage.service';

export const GOOGLE_CLOUD_STORAGE_MODULE_OPTIONS = 'GOOGLE_CLOUD_STORAGE_MODULE_OPTIONS';
export const GOOGLE_CLOUD_STORAGE_NAME = 'GOOGLE_CLOUD_STORAGE_NAME';
export const GOOGLE_CLOUD_STORAGE_URI = 'https://storage.googleapis.com/';
export const PROVIDERS = [
    GoogleCloudStorageService,
];