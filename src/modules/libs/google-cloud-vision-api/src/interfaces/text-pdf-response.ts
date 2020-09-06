import {LROperation} from 'google-gax';
import * as protos from '@google-cloud/vision/build/protos/protos';

export type TextPdfResponse = Promise<[
    LROperation<protos.google.cloud.vision.v1.IAsyncBatchAnnotateFilesResponse,
        protos.google.cloud.vision.v1.IOperationMetadata>,
        protos.google.longrunning.IOperation | undefined, {} | undefined,
]>;
