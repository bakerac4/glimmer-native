import ElementNode from '../nodes/ElementNode';
import ViewNode from '../nodes/ViewNode';
export default class DivElement extends ElementNode {
    constructor();
    onInsertedChild(childNode: ViewNode, atIndex: number): void;
}
