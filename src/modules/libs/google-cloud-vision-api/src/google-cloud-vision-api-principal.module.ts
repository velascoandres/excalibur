import { DynamicModule, Module, Provider } from '@nestjs/common';
import { GCP_VISION_API_CLIENT } from './constants';
import { GoogleCloudVisionApiService } from './google-cloud-vision-api.service';
import {ImageAnnotatorClient} from '@google-cloud/vision';

@Module(
  {
    providers: [
      GoogleCloudVisionApiService
    ],
    exports: [
      GoogleCloudVisionApiService
    ]
  }
)
export class GoogleCloudVisionApiPrincipalModule {

  static register(): DynamicModule{
    return  {
      module: GoogleCloudVisionApiPrincipalModule,
      providers: [
        ...this.buildProviders,
      ],
      exports: [
        ...this.buildProviders,
      ]
    };
  }

  private static get buildProviders() {
    const clientGCP = new ImageAnnotatorClient();

    const injeccionDelClienteGPC: Provider = {
      provide: GCP_VISION_API_CLIENT,
      useValue: clientGCP,
    };
    const injeccionDelServicio: Provider = {
      provide: GoogleCloudVisionApiService,
      useFactory: (cliente: any) => new GoogleCloudVisionApiService(cliente),
      inject: [GCP_VISION_API_CLIENT]
    };
    return [
      injeccionDelClienteGPC,
      injeccionDelServicio,
    ];
  }
}
