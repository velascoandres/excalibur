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

import {Inject, Injectable} from '@nestjs/common';
import {GOOGLE_CLOUD_STORAGE_MODULE_OPTIONS, GOOGLE_CLOUD_STORAGE_URI} from './constants';
import {GoogleCloudStorageOptions, GoogleCloudStoragePerRequestOptions, UploadedFileMetadata} from './interfaces';
import {Bucket, CreateWriteStreamOptions, Storage} from '@google-cloud/storage';
import {join} from 'path';
import {v4 as uuidV4} from 'uuid';
import {File} from '@google-cloud/storage/build/src/file';

@Injectable()
export class GoogleCloudStorageService {
    public storage: Storage = new Storage();

    constructor(
        @Inject(GOOGLE_CLOUD_STORAGE_MODULE_OPTIONS)
        private  options: GoogleCloudStorageOptions) {
        // console.log('GCloudStorageService.options', options);
    }

    get getbucket(): Bucket {
        const bucketName = this.options.bucketDefaultName;
        return this.storage.bucket(bucketName);
    }

    generateFileNameGC(perRequestOptions?: Partial<GoogleCloudStoragePerRequestOptions>): string {
        const fileUniqueName = uuidV4();
        if (perRequestOptions && perRequestOptions.prefix) {
            const prefix = perRequestOptions.prefix;
            return join(prefix, fileUniqueName);
        }
        return fileUniqueName;
    }

    async upload(
        metadataArchivo: UploadedFileMetadata,
        perRequestOptions?: Partial<GoogleCloudStoragePerRequestOptions>,
    ): Promise<string> {
        const googleCloudFileName: string = this.generateFileNameGC(perRequestOptions);
        const formatedFileToUpload: File = this.getbucket.file(googleCloudFileName);
        // sobrescribir las opciones globales con las opciones de la peticion
        perRequestOptions = {
            ...this.options,
            ...perRequestOptions,
        };

        const writeStreamOptions = perRequestOptions && perRequestOptions.writeStreamOptions;

        const streamOptions: CreateWriteStreamOptions = {
            predefinedAcl: 'publicRead',
            ...writeStreamOptions,
        };

        const contentType = metadataArchivo.mimetype;

        if (contentType) {
            streamOptions.metadata = {contentType};
        }
        return new Promise((resolve, reject) => {
            formatedFileToUpload
                .createWriteStream(streamOptions)
                .on('error', error => reject(error))
                .on('finish', () => resolve(
                    // Cuando este OK se retornara la uri del archivo subido
                    this.getStorageUrl(googleCloudFileName, perRequestOptions),
                    ),
                )
                .end(metadataArchivo.buffer);
        });
    }

    // obtener la uri del almacenamiento
    getStorageUrl(
        fileName: string,
        perRequestOptions?: Partial<GoogleCloudStoragePerRequestOptions>,
    ) {
        if (perRequestOptions && perRequestOptions.storageBaseUri) {
            return join(perRequestOptions.storageBaseUri, fileName);
        }
        const bucketName = perRequestOptions && perRequestOptions.bucketDefaultName ? perRequestOptions.bucketDefaultName : '';
        return GOOGLE_CLOUD_STORAGE_URI + join(bucketName, fileName);
    }
}
