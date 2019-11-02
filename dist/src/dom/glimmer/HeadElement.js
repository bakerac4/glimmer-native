import ElementNode from '../nodes/ElementNode';
export default class HeadElement extends ElementNode {
    constructor() {
        super('head');
    }
    onInsertedChild(childNode, atIndex) { }
}
