import {SelectQueryBuilder} from 'typeorm';
import {buildPureSelect} from './build-pure-select';

export function buildSelect(query: SelectQueryBuilder<any>, parent: string, attrs: string[], add: boolean = true): SelectQueryBuilder<any> {
    const selectArray = buildPureSelect(parent, attrs);
    if (add) {
        return query.addSelect(selectArray);
    } else {
        return query.select(selectArray);
    }
}
