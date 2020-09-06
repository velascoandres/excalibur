import { Module } from '@nestjs/common';
import { GoogleCloudVisionApiService } from './google-cloud-vision-api.service';
import { GoogleCloudVisionApiPrincipalModule } from './google-cloud-vision-api-principal.module';


@Module(
  {
    imports: [
      GoogleCloudVisionApiPrincipalModule.register()
    ],
    providers: [
      GoogleCloudVisionApiService
    ],
    exports: [
      GoogleCloudVisionApiService
    ]
  }
)
export class GoogleCloudVisionApiModule {
}
