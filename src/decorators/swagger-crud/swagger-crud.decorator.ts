import {CrudApiConfig} from './interfaces';
import {SwaggerHelper} from './swagger-helpers/swagger.helper';


export function CrudApiBody(
    options: CrudApiConfig,
) {
    return (target: any) => {
        const createOneOptions = options.createOne;
        const updateOneOptions = options.updateOne;
        const findAllOptions = options.findAll;
        if (createOneOptions) {
            SwaggerHelper.buildApiBody(createOneOptions, 'createOne', target);
        }
        if (updateOneOptions) {
            SwaggerHelper.buildApiBody(updateOneOptions, 'updateOne', target);
        }
        if (findAllOptions) {
            SwaggerHelper.buildApiQuery(findAllOptions, 'findAll', target);
        }
        return target;
    }
}
