import ViewNode from './ViewNode';
export default class ElementNode extends ViewNode {
    style: any;
    constructor(tagName: any);
    setAttribute(key: any, value: any): void;
    appendChild(childNode: any): void;
    insertBefore(childNode: any, referenceNode: any): void;
    removeChild(childNode: any): void;
}
