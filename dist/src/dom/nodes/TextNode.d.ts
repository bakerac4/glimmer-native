import ViewNode from './ViewNode';
export default class TextNode extends ViewNode {
    text: any;
    constructor(text: any);
    setText(text: any): void;
}
