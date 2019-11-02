import ElementNode from '../dom/nodes/ElementNode';
export declare function registerElement(elementName: string, resolver: () => ElementNode): void;
export declare function createElement(elementName: string): ElementNode;
