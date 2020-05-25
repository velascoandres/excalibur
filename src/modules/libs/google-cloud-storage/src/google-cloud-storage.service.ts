import {Inject, Injectable} from '@nestjs/common';
import {GOOGLE_CLOUD_STORAGE_MODULE_OPTIONS, GOOGLE_CLOUD_STORAGE_URI} from './constantes';
import {GoogleCloudStorageOptions, GoogleCloudStoragePerRequestOptions, UploadedFileMetadata} from './interfaces';
import {Bucket, CreateWriteStreamOptions, Storage} from '@google-cloud/storage';
import {join} from 'path';
import {v4 as uuidV4} from 'uuid';
import {File} from '@google-cloud/storage/build/src/file';

@Injectable()
export class GoogleCloudStorageService {
    public almacenamiento: Storage = new Storage();

    constructor(
        @Inject(GOOGLE_CLOUD_STORAGE_MODULE_OPTIONS)
        private  options: GoogleCloudStorageOptions) {
        console.log('GCloudStorageService.options', options);
    }

    get obtenerBucket(): Bucket {
        const nombreBucket = this.options.bucketDefaultName;
        return this.almacenamiento.bucket(nombreBucket);
    }

    generarNombreArchivoGC(perRequestOptions?: Partial<GoogleCloudStoragePerRequestOptions>): string {
        const nombreArchivoUnico = uuidV4();
        if (perRequestOptions && perRequestOptions.prefix) {
            const prefijo = perRequestOptions.prefix;
            return join(prefijo, nombreArchivoUnico);
        }
        return nombreArchivoUnico;
    }

    async upload(
        metadataArchivo: UploadedFileMetadata,
        perRequestOptions?: Partial<GoogleCloudStoragePerRequestOptions>,
    ): Promise<string> {
        const nombreArchivoGoogleCloud: string = this.generarNombreArchivoGC(perRequestOptions);
        const archivoParaSubirFormateado: File = this.obtenerBucket.file(nombreArchivoGoogleCloud);
        // sobrescribir las opciones globales con las opciones de la peticion
        perRequestOptions = {
            ...this.options,
            ...perRequestOptions,
        };

        const opcionesEscribirStream = perRequestOptions && perRequestOptions.writeStreamOptions;

        const opcionesStream: CreateWriteStreamOptions = {
            predefinedAcl: 'publicRead',
            ...opcionesEscribirStream,
        };

        const tipoContenido = metadataArchivo.mimetype;

        if (tipoContenido) {
            opcionesStream.metadata = {contentType: tipoContenido};
        }
        return new Promise((resolve, reject) => {
            archivoParaSubirFormateado
                .createWriteStream(opcionesStream)
                .on('error', error => reject(error))
                .on('finish', () => resolve(
                    // Cuando este OK se retornara la uri del archivo subido
                    this.obtenerUrlAlmacenamiento(nombreArchivoGoogleCloud, perRequestOptions),
                    ),
                )
                .end(metadataArchivo.buffer);
        });
    }

    // obtener la uri del almacenamiento
    obtenerUrlAlmacenamiento(
        nombreArchivo: string,
        perRequestOptions?: Partial<GoogleCloudStoragePerRequestOptions>,
    ) {
        if (perRequestOptions && perRequestOptions.storageBaseUri) {
            return join(perRequestOptions.storageBaseUri, nombreArchivo);
        }
        const nombreBucket = perRequestOptions && perRequestOptions.bucketDefaultName ? perRequestOptions.bucketDefaultName : '';
        return GOOGLE_CLOUD_STORAGE_URI + join(nombreBucket, nombreArchivo);
    }
}
