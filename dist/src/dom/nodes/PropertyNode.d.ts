import ElementNode from './ElementNode';
import ViewNode from './ViewNode';
export default class PropertyNode extends ElementNode {
    propertyName: string;
    propertyTagName: string;
    constructor(tagName: string, propertyName: string);
    onInsertedChild(): void;
    onRemovedChild(): void;
    toString(): string;
    setOnNode(parent: ViewNode): void;
    clearOnNode(parent: ViewNode): void;
}
