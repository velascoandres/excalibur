import {SelectQueryBuilder} from 'typeorm';
import {buildPureSelect} from './build-pure-select';

export function buildSelect(query: SelectQueryBuilder<any>, parent: string, attrs: string[]): SelectQueryBuilder<any> {
    const selectArray = buildPureSelect(parent, attrs);
    return query.select(selectArray);
}
