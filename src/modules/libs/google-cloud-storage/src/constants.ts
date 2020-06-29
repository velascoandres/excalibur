import {GoogleCloudStorageService} from './google-cloud-storage.service';

export const GOOGLE_CLOUD_STORAGE_MODULE_OPTIONS = 'GOOGLE_CLOUD_STORAGE_MODULE_OPTIONS';
export const GOOGLE_CLOUD_STORAGE_NAME = 'GOOGLE_CLOUD_STORAGE_NAME';
export const GOOGLE_CLOUD_STORAGE_URI = 'https://storage.googleapis.com/';
export const PROVIDERS = [
    GoogleCloudStorageService,
];

/*
This file is a partial modification of the following project:
Full project source: https://github.com/Aginix/nestjs-gcloud-storage
Copyright 2020 by Sam Aginix (https://github.com/Aginix).
All rights reserved.
 */