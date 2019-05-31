import ListView from '../native/list-view';
import CommentNode from './CommentNode';
import ElementNode from './ElementNode';
import TextNode from './TextNode';
import ViewNode from './ViewNode';
export default class DocumentNode extends ViewNode {
    head: any;
    constructor();
    createComment(text: any): CommentNode;
    createElement(tagName: any): ElementNode | ListView;
    createElementNS(namespace: any, tagName: any): ElementNode | ListView;
    createTextNode(text: any): TextNode;
    getElementById(id: any): any;
}
