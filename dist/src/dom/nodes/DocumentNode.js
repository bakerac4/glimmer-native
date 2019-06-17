import ListView from '../native/list-view';
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
        this.head = new ElementNode('head');
        this.appendChild(this.head);
    }
    createComment(text) {
        return new CommentNode(text);
    }
    createElement(tagName) {
        if (tagName === 'listview') {
            return new ListView();
        }
        else {
            return new ElementNode(tagName);
        }
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
