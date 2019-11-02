import { createElement } from '../element-registry';
import CommentNode from './CommentNode';
import ElementNode from './ElementNode';
import PropertyNode from './PropertyNode';
import TextNode from './TextNode';
import ViewNode, { elementIterator } from './ViewNode';

export default class DocumentNode extends ViewNode {
    constructor() {
        super();
        this.tagName = 'docNode';
        this.nodeType = 9;
    }

    createComment(text: string): CommentNode {
        return new CommentNode(text);
    }

    createPropertyNode(tagName: string, propertyName: string): PropertyNode {
        return new PropertyNode(tagName, propertyName);
    }

    createElement(tagName: string): ElementNode {
        if (tagName.indexOf('.') >= 0) {
            let bits = tagName.split('.', 2);
            return this.createPropertyNode(bits[0], bits[1]);
        }
        return createElement(tagName);
    }

    createElementNS(namespace: string, tagName: string): ElementNode {
        return this.createElement(tagName);
    }

    createTextNode(text: string) {
        return new TextNode(text);
    }

    getElementById(id: string) {
        for (let el of elementIterator(this)) {
            if (el.nodeType === 1 && (el as ElementNode).id === id) return el;
        }
    }

    dispatchEvent(event: any) {
        //Svelte dev fires these for tool support
    }
}
