import {Inject, Injectable} from '@nestjs/common';
import {GCP_VISION_API_CLIENT} from './constants';
import {ImageAnnotatorClient} from '@google-cloud/vision/build/src/v1/image_annotator_client';
import {google} from '@google-cloud/vision/build/protos/protos';
import {TextFromPDFCongig} from './interfaces/text-from-pdf.congig';
import IAsyncBatchAnnotateFilesRequest = google.cloud.vision.v1.IAsyncBatchAnnotateFilesRequest;
import IFeature = google.cloud.vision.v1.IFeature;
import IEntityAnnotation = google.cloud.vision.v1.IEntityAnnotation;
import ITextAnnotation = google.cloud.vision.v1.ITextAnnotation;
import ISafeSearchAnnotation = google.cloud.vision.v1.ISafeSearchAnnotation;
import ILocalizedObjectAnnotation = google.cloud.vision.v1.ILocalizedObjectAnnotation;
import IImageProperties = google.cloud.vision.v1.IImageProperties;
import IFaceAnnotation = google.cloud.vision.v1.IFaceAnnotation;
import {TextPdfResponse} from './interfaces/text-pdf-response';

@Injectable()
export class GoogleCloudVisionApiService {
    constructor(
        @Inject(GCP_VISION_API_CLIENT)
        private client: ImageAnnotatorClient
    ) {

    }

    async detectLabels(image: string | Buffer)
        : Promise<google.cloud.vision.v1.IEntityAnnotation[]> {
        const [results] = await this.client.labelDetection(image);
        return results.labelAnnotations as google.cloud.vision.v1.IEntityAnnotation[];
    }

    async detectFaces(image: string | Buffer)
        : Promise<IFaceAnnotation[]> {
        const [results] = await this.client.faceDetection(image);
        return results.faceAnnotations as IFaceAnnotation[];
    }

    async detectProperties(image: string | Buffer)
        : Promise<IImageProperties> {
        const [results] = await this.client.imageProperties(image);
        return results.imagePropertiesAnnotation as IImageProperties;
    }

    async detectLandMarks(image: string | Buffer)
        : Promise<IEntityAnnotation[]> {
        const [results] = await this.client.landmarkDetection(image);
        return results.landmarkAnnotations as IEntityAnnotation[];
    }

    async detectLogos(image: string | Buffer)
        : Promise<IEntityAnnotation[]> {
        const [results] = await this.client.logoDetection(image);
        return results.logoAnnotations as IEntityAnnotation[];
    }

    async detectMultipleObjects(image: string | Buffer)
        : Promise<ILocalizedObjectAnnotation[]> {
        const [results] = await (this.client.objectLocalization as any)(image);
        return results.localizedObjectAnnotations as ILocalizedObjectAnnotation[];
    }

    async detectExplicitContent(image: string | Buffer)
        : Promise<ISafeSearchAnnotation> {
        const [results] = await this.client.safeSearchDetection(image);
        return results.safeSearchAnnotation as ISafeSearchAnnotation;
    }

    async detectText(image: string | Buffer)
        : Promise<IEntityAnnotation[]> {
        const [results] = await this.client.textDetection(image);
        return results.textAnnotations as IEntityAnnotation[];
    }

    async detectHandwrittenText(image: string | Buffer)
        : Promise<ITextAnnotation> {
        const [results] = await this.client.documentTextDetection(image);
        return results.fullTextAnnotation as ITextAnnotation;
    }

    async detectTextFromPdfFile(
        config: TextFromPDFCongig,
    ): TextPdfResponse {
        const gcsDestinationUri = `gs://${config.bucketName}/${config.prefix}/`;
        const inputConfig = {
            mimeType: 'application/pdf',
            gcsSource: {
                uri: config.filePath,
            },
        };
        const outputConfig = {
            gcsDestination: {
                uri: gcsDestinationUri,
            },
        };
        const features: IFeature[] = [{type: 'DOCUMENT_TEXT_DETECTION'}];
        const peticion: IAsyncBatchAnnotateFilesRequest = {
            requests: [
                {
                    inputConfig,
                    features,
                    outputConfig,
                },
            ],
        };
        return await this.client.asyncBatchAnnotateFiles(peticion) as unknown as TextPdfResponse;
    }
}
