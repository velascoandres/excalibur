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

    generateFileNameGC(perRequestOptions?: Partial<GoogleCloudStoragePerRequestOptions>, uploadWithName?: string,
    ): string {
        const fileName = uploadWithName ? uploadWithName : uuidV4();
        if (perRequestOptions && perRequestOptions.prefix) {
            const prefix = perRequestOptions.prefix;
            return join(prefix, fileName);
        }
        return fileName;
    }

    async upload(
        fileMetadata: UploadedFileMetadata,
        perRequestOptions?: Partial<GoogleCloudStoragePerRequestOptions>,
        uploadWithName?: string,
    ): Promise<string> {
        const googleCloudFileName: string = uploadWithName ? uploadWithName : this.generateFileNameGC(perRequestOptions, uploadWithName);
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

        const contentType = fileMetadata.mimetype;

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
                .end(fileMetadata.buffer);
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

/*
This file is a partial modification of the following project:
Full project source: https://github.com/Aginix/nestjs-gcloud-storage
Copyright 2020 by Sam Aginix (https://github.com/Aginix).
All rights reserved.
 */
