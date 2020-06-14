import {
    isEmpty,
    isInt,
    isNumber, IsNumberOptions,
    isNumberString,
    isString,
} from 'class-validator';
import {TypesCollectionInterface} from './types-collection.interface';
import ValidatorJS from 'validator';

export const GENERIC_TYPE_VALIDATOR: TypesCollectionInterface = {
    string: (value: any): boolean => isString(value),
    int: (value: any): boolean => isInt(value),
    numberString: (value: any, opts?: ValidatorJS.IsNumericOptions): boolean => isNumberString(value, opts),
    number: (value: any, opts?: IsNumberOptions): boolean => isNumber(value, opts),
    empty: (value: any): boolean => isEmpty(value),
};