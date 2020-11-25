import {Inject, Injectable} from '@nestjs/common';
import {GOOGLE_CLOUD_STORAGE_MODULE_OPTIONS, GOOGLE_CLOUD_STORAGE_URI} from './constants';
import {GoogleCloudStorageOptions, GoogleCloudStoragePerRequestOptions, UploadedFileMetadata} from './interfaces';
import {
    Bucket,
    CreateWriteStreamOptions,
    DownloadResponse,
    GetFilesResponse,
    MakeFilePublicResponse,
    Storage
} from '@google-cloud/storage';
import * as path from 'path';
import {v4 as uuidV4} from 'uuid';
import {DownloadOptions, File} from '@google-cloud/storage/build/src/file';
import {DeleteFilesOptions, GetFilesOptions} from '@google-cloud/storage/build/src/bucket';
import * as r from 'teeny-request';
import {DeleteOptions} from '@google-cloud/common/build/src/service-object';

@Injectable()
export class GoogleCloudStorageService {
    private _storage: Storage = new Storage();

    constructor(
        @Inject(GOOGLE_CLOUD_STORAGE_MODULE_OPTIONS)
        private  options: GoogleCloudStorageOptions) {
    }

    get storage(): Storage {
        return this._storage;
    }

    get bucket(): Bucket {
        const bucketName = this.options.bucketDefaultName;
        return this._storage.bucket(bucketName);
    }

    protected generateFileNameGC(perRequestOptions?: Partial<GoogleCloudStoragePerRequestOptions>): string {
        const fileName = perRequestOptions && perRequestOptions.uploadAs ? perRequestOptions.uploadAs : uuidV4();
        if (perRequestOptions && perRequestOptions.prefix) {
            const prefix = perRequestOptions.prefix;
            return path.posix.join(prefix, fileName);
        }
        return fileName;
    }

    async upload(
        fileMetadata: UploadedFileMetadata,
        perRequestOptions?: Partial<GoogleCloudStoragePerRequestOptions>,
    ): Promise<string> {
        const googleCloudFileName: string = this.generateFileNameGC(perRequestOptions);
        const formatedFileToUpload: File = this.bucket.file(googleCloudFileName);
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
            return path.posix.join(perRequestOptions.storageBaseUri, fileName);
        }
        const bucketName = perRequestOptions && perRequestOptions.bucketDefaultName ? perRequestOptions.bucketDefaultName : '';
        return GOOGLE_CLOUD_STORAGE_URI + path.posix.join(bucketName, fileName);
    }

    downloadFile(filename: string, options?: DownloadOptions): Promise<DownloadResponse> {
        return this.bucket.file(filename).download(options);
    }

    downloadFiles(query?: GetFilesOptions): Promise<GetFilesResponse> {
        return this.bucket.getFiles(query);
    }

    deleteFile(options?: DeleteOptions): Promise<[r.Response]> {
        return this.bucket.delete(options);
    }

    deleteFiles(query?: DeleteFilesOptions) {
        return this.bucket.deleteFiles(query);
    }

    makeFilePublic(filename: string): Promise<MakeFilePublicResponse> {
        return this.bucket.file(filename).makePublic();
    }
}

