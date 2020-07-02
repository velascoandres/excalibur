import {HeaderInterface} from './interfaces/header.interface';

export function CrudHeaders(
    options: HeaderInterface,
) {
    return (target: any) => {
        return target;
    };
}