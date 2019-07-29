import CommentNode from './CommentNode';
import ElementNode from './ElementNode';
import PropertyNode from './PropertyNode';
import TextNode from './TextNode';
import ViewNode from './ViewNode';
export default class DocumentNode extends ViewNode {
    head: any;
    constructor();
    createComment(text: any): CommentNode;
    createPropertyNode(tagName: string, propertyName: string): PropertyNode;
    createElement(tagName: any): ElementNode;
    createElementNS(namespace: any, tagName: any): ElementNode;
    createTextNode(text: any): TextNode;
    getElementById(id: any): any;
}
