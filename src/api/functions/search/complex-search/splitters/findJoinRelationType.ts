import {CuerpoConsultaFindFull} from '../../../../..';

export function findJoinRelationType(
    subQueryObject: CuerpoConsultaFindFull,
): 'inner' | 'left' {
    const existsRelation = !!subQueryObject.$join;
    if (existsRelation) {
        return subQueryObject.$join as 'left';
    } else {
        return 'inner';
    }
}