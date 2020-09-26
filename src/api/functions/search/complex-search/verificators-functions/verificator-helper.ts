import {ATTR_KEYWORDS, OR_KEYWORD, QUERY_OPERATORS} from '../constants/query-operators';

export class VerificatorHelper {

    static verifyIsObject(value: any): boolean {
        return value !== null && (typeof value === 'object') && !(value instanceof Array);
    }

    static verifyIsNotEmptyObject(object: any): boolean {
        const keys = Object.keys(object);
        return keys.length > 0;
    }

    static isComplexOperatorObject(object: any): boolean {
        const operatorKeys = Object.keys(object);
        const length = Object.keys(object).length;
        const hasOneKey = length === 2 || length === 1;
        if (hasOneKey) {
            const operator = operatorKeys[0];
            if (QUERY_OPERATORS.includes(operator)) {
                const value = object[operator];
                if (typeof value === 'number' || typeof value === 'string' || (value && value.length >= 0)) {
                    if (length === 2) {
                        const conjunction = operatorKeys[1];
                        return conjunction === OR_KEYWORD && typeof object[conjunction] === 'boolean';
                    }
                    return true;
                }
            }
        }
        return false;
    }

    static IsSimpleOr(object: any): boolean {
        const hasProperties = object.conjunction && object.values;
        if (hasProperties) {
            if (object.conjunction === 'or' && object.conjunction === 'and') {
                return true;
            }
        }
        return false;
    }

    static isAttKeyWord(attr: string): boolean {
        return ATTR_KEYWORDS.includes(attr);
    }
}
