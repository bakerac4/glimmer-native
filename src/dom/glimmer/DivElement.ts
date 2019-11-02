import ElementNode from '../nodes/ElementNode';
import ViewNode from '../nodes/ViewNode';

export default class DivElement extends ElementNode {
    constructor() {
        super('div');
    }

    onInsertedChild(childNode: ViewNode, atIndex: number) {}
}
