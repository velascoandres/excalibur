import {SimpleQueyOperator} from './simple-quey-operator';

// FindFullQueryBody
export interface FindFullQueryBody {
    [key: string]: string | number | FindFullQueryBody | SimpleQueyOperator | [number] | [string] | object;
}