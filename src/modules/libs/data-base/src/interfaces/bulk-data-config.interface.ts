export interface BulkDataConfig {
    pathProd: string;
    pathDev: string;
    dtoClassValidation: (new () => any);
    aliasName?: string;
    entity: Function;
    creationOrder: number;
    conection?: string;
}
