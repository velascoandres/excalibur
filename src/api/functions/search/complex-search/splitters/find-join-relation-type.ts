import {FindFullQueryBody} from '../../../../..';
import {JOIN_KEYWORD} from '../constants/query-operators';

export function findJoinRelationType(
    subQueryObject: FindFullQueryBody,
): 'inner' | 'left' {
    const existsRelation = !!subQueryObject[JOIN_KEYWORD];
    if (existsRelation) {
        return subQueryObject[JOIN_KEYWORD] as 'left';
    } else {
        return 'inner';
    }
}