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

import {MulterOptions} from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import {GoogleCloudStoragePerRequestOptions} from '../interfaces';
import {
    BadGatewayException,
    CallHandler,
    ExecutionContext,
    Injectable,
    mixin,
    NestInterceptor,
    Type
} from '@nestjs/common';
import {GoogleCloudStorageService} from '../google-cloud-storage.service';
import {Observable, of} from 'rxjs';
import {FileInterceptor} from '@nestjs/platform-express';


export function GoogleCloudStorageFileInterceptor(
    fieldName: string,
    localOptions?: MulterOptions,
    googleClodudStorageOptions?: Partial<GoogleCloudStoragePerRequestOptions>,
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
            const localInterceptor = (await this.interceptor.intercept(context, next)) as Observable<any>;
            const request = context.switchToHttp().getRequest();
            // console.log('request', request.file);
            const file = request.file;

            if (!file || (file && file.fieldname !== fieldName)) {
                // Logger.error(
                //     'Error on intercept file: ',
                //     `File with fieldName: "${fieldName}" not found`,
                // );
                throw new BadGatewayException({
                    message: `Error on intercept file:
                    File with fieldName: "${fieldName}" not found`
                });
                // return of(undefined);
            }
            file.storageUrl = await this._googleCloudStorageService.upload(file, googleClodudStorageOptions);
            return next.handle();
        }
    }

    return mixin(GoogleCloudStorageFileInterceptorMixin);
}