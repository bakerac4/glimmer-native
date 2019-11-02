import { normalizeElementName } from './nodes/ViewNode';
const elementMap = {};
function registerElementResolver(elementName, entry) {
    const normalizedName = normalizeElementName(elementName);
    if (elementMap[normalizedName]) {
        throw new Error(`Element for ${normalizedName} already registered.`);
    }
    elementMap[normalizedName] = entry;
}
export function registerElement(elementName, resolver) {
    registerElementResolver(elementName, { resolver: resolver });
}
export function createElement(elementName) {
    const normalizedName = normalizeElementName(elementName);
    const elementDefinition = elementMap[normalizedName];
    if (!elementDefinition) {
        throw new TypeError(`No known component for element ${elementName}.`);
    }
    return elementDefinition.resolver();
}
