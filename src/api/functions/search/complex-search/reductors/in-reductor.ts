export function inReductor(
    values: string[] | number[],
): string {
    const length = values.length;
    return (values as []).reduce(
        (acumulator: string, currentValue: string | number, index: number) => {
            const isNumber = typeof currentValue === 'number';
            const isString = typeof currentValue === 'string';
            const isLast = index + 1 === length;
            if (isNumber) {
                acumulator += currentValue;
            }
            if (isString){
                acumulator += `"${currentValue}"`;
            }
            acumulator += `${isLast? ''  : ','}`;
            return acumulator;
        },
        ''
    );
}