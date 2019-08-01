import { createElement } from '../element-registry';
import CommentNode from './CommentNode';
import ElementNode from './ElementNode';
import PropertyNode from './PropertyNode';
import TextNode from './TextNode';
import ViewNode from './ViewNode';

function* elementIterator(el: any) {
    yield el;
    for (let child of el.childNodes) {
        yield* elementIterator(child);
    }
}

export default class DocumentNode extends ViewNode {
    head: any;
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

    createPropertyNode(tagName: string, propertyName: string): PropertyNode {
        return new PropertyNode(tagName, propertyName);
    }

    createElement(tagName) {
        if (tagName.indexOf('.') >= 0) {
            let bits = tagName.split('.', 2);
            return this.createPropertyNode(bits[0], bits[1]);
        }
        return createElement(tagName);
    }

    createElementNS(namespace, tagName) {
        return this.createElement(tagName);
    }

    createTextNode(text) {
        return new TextNode(text);
    }

    getElementById(id) {
        for (let el of elementIterator(this)) {
            if (el.nodeType === 1 && el.id === id) return el;
        }
    }
}
