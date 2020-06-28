import {ComplexOperator} from './complex-operator-type';

export interface AttributesSplitedQuery {
    simpleQueries: string[];
    complexOperatorsQueries: ComplexOperator[];
    complexQueries:  string[];
    whereOrQueries: string[];
}

