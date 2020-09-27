export function buildPureSelect(parent: string, attrs: string[]): string[] {
    return attrs.reduce(
        (acc: string[], attr: string) => {
            if (attr.toLowerCase() !== 'id') {
                acc.push(`${parent}.${attr}`);
            }
            return acc;
        }, [`${parent}.id`],
    );
}
