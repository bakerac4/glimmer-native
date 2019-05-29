import CommentNode from './CommentNode';
import ElementNode from './ElementNode';
import TextNode from './TextNode';
import ViewNode from './ViewNode';
function* elementIterator(el) {
    yield el;
    for (let child of el.childNodes) {
        yield* elementIterator(child);
    }
}
export default class DocumentNode extends ViewNode {
    constructor() {
        super();
        this.tagName = 'docNode';
        this.nodeType = 9;
        //this.documentElement = new ElementNode('document')
        this.head = new ElementNode('head');
        this.appendChild(this.head);
        /*// make static methods accessible via this
        this.createComment = DocumentNode.createComment
        this.createElement = DocumentNode.createElement
        this.createElementNS = DocumentNode.createElementNS
        this.createTextNode = DocumentNode.createTextNode*/
        console.log(`created ${this}`);
    }
    createComment(text) {
        return new CommentNode(text);
    }
    createElement(tagName) {
        return new ElementNode(tagName);
    }
    createElementNS(namespace, tagName) {
        return this.createElement(tagName);
    }
    createTextNode(text) {
        return new TextNode(text);
    }
    getElementById(id) {
        for (let el of elementIterator(this)) {
            if (el.nodeType === 1 && el.id === id)
                return el;
        }
    }
}
