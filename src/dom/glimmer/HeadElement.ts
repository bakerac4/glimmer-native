import ElementNode from '../nodes/ElementNode';
import ViewNode from '../nodes/ViewNode';

export default class HeadElement extends ElementNode {
    constructor() {
        super('head');
    }

    onInsertedChild(childNode: ViewNode, atIndex: number) {}
}
