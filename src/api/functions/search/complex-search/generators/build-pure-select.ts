export function buildPureSelect(parent: string, attrs: string[]) {
    return attrs.map(
        (attr: string) => `${parent}.${attr}`,
    );
}
