export interface BulkDataConfig<T extends (new () => any)  = (new () => any) > {
    pathProd?: string;
    pathDev: string;
    dtoClassValidation?: (new () => any) | any;
    aliasName?: string;
    entity: T;
    creationOrder: number;
    connection?: string;
    refs?: Partial<Record<keyof T, string>>;

}
