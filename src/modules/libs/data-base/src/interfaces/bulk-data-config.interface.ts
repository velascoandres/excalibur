export interface BulkDataConfig {
    pathProd?: string;
    pathDev: string;
    dtoClassValidation?: (new () => any) | any;
    aliasName?: string;
    entity: Function;
    creationOrder: number;
    connection?: string;
}
