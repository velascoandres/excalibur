import {SimpleQueyOperator} from './simple-quey-operator';

// FindFullQueryBody
export interface FindFullQueryBody<T = any> {
    [key: string]: string | number | FindFullQueryBody | SimpleQueyOperator | [number] | [string] | object | Body<T>;
}

export type Body<T = any> = Partial<Record<keyof T, FindFullQueryBody>>;
