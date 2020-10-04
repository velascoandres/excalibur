export interface BulkDataConfig {
    pathProd: string;
    pathDev: string;
    dtoClassValidation: (new () => any);
    aliasName?: string;
    entityName: Function;
    creationOrder: number;
    conection?: string;
}
