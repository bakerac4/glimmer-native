import ElementNode from '../nodes/ElementNode';
export default class DivElement extends ElementNode {
    constructor() {
        super('div');
    }
    onInsertedChild(childNode, atIndex) { }
}
