import {MulterOptions} from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import {GoogleCloudStorageOptions} from '../interfaces';
import {CallHandler, ExecutionContext, Injectable, Logger, mixin, NestInterceptor, Type} from '@nestjs/common';
import {GoogleCloudStorageService} from '../google-cloud-storage.service';
import {Observable, of} from 'rxjs';
import {FileInterceptor} from '@nestjs/platform-express';


export function GoogleCloudStorageFileInterceptor(
    fieldName: string,
    localOptions?: MulterOptions,
    googleClodudStorageOptions?: Partial<GoogleCloudStorageOptions>,
): Type<NestInterceptor> {

    @Injectable()
    class GoogleCloudStorageFileInterceptorMixin implements NestInterceptor {

        public interceptor: NestInterceptor;

        constructor(
            private readonly _googleCloudStorageService: GoogleCloudStorageService,
        ) {
            this.interceptor = new (FileInterceptor(fieldName, localOptions))();
        }

        async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
            const interceptorlocal = (await this.interceptor.intercept(context, next)) as Observable<any>;
            const request = context.switchToHttp().getRequest();
            const file = request[fieldName];

            if (!file) {
                Logger.error(
                    'Error on intercept file: ',
                    `File with fieldName: "${fieldName}" not found`,
                );
                return of(undefined);
            }
            file.storageUrl = await this._googleCloudStorageService.upload(file, googleClodudStorageOptions);
            return next.handle();
        }
    }

    return mixin(GoogleCloudStorageFileInterceptorMixin);
}