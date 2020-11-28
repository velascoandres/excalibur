import { ModuleMetadata } from '@nestjs/common/interfaces';
import { StorageOptions, CreateWriteStreamOptions } from '@google-cloud/storage';

export interface GoogleCloudStorageOptions extends StorageOptions {
    bucketDefaultName: string;
    storageBaseUri?: string;
}

export interface GoogleCloudStoragePerRequestOptions extends GoogleCloudStorageOptions {
    writeStreamOptions?: CreateWriteStreamOptions;
    prefix?: string;
    uploadAs?: string;
}

export type AsyncFactory = (...args: any[]) => Promise<GoogleCloudStorageOptions> | GoogleCloudStorageOptions;

export interface GoogleCloudStorageAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    name?: string;
    useFactory?: AsyncFactory;
    inject?: any[];
}


export interface UploadedFileMetadata {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: string;
    storageUrl?: string;
}


export interface DownladedFile {
    filename: string;
    buffer: Buffer;
}
/*
This file is a partial modification of the following project:
Full project source: https://github.com/Aginix/nestjs-gcloud-storage
Copyright 2020 by Sam Aginix (https://github.com/Aginix).
All rights reserved.
 */
