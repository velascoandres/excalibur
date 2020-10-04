export interface BulkDataConfig {
    pathProd: string;
    pathDev: string;
    dtoClassValidation: Function;
    aliasName?: string;
    creationOrder: number;
    conection?: string;
}
