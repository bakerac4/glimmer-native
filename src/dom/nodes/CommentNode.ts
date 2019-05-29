import ElementNode from './ElementNode';

export default class CommentNode extends ElementNode {
    nodeType: any;
    text: any;
    constructor(text: any) {
        super('comment');

        this.nodeType = 8;
        this.text = text;
        console.log(`created ${this}`);
    }
}
