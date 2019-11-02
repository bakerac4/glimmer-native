import CommentNode from './CommentNode';
import ElementNode from './ElementNode';
import PropertyNode from './PropertyNode';
import TextNode from './TextNode';
import ViewNode from './ViewNode';
export default class DocumentNode extends ViewNode {
    constructor();
    createComment(text: string): CommentNode;
    createPropertyNode(tagName: string, propertyName: string): PropertyNode;
    createElement(tagName: string): ElementNode;
    createElementNS(namespace: string, tagName: string): ElementNode;
    createTextNode(text: string): TextNode;
    getElementById(id: string): ViewNode;
    dispatchEvent(event: any): void;
}
