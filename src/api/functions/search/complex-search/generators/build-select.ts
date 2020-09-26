import {SelectQueryBuilder} from 'typeorm';

export function buildSelect(query: SelectQueryBuilder<any>, parent: string, attrs: string[]): SelectQueryBuilder<any> {
    const selectArray = attrs.map(
        (attr: string) => `${parent}.${attr}`,
    );
    return query.select(selectArray);
}
