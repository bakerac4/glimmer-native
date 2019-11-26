import ViewNode from './ViewNode';
export default class TextNode extends ViewNode {
    text: string;
    constructor(text: string);
    setText(text: string): void;
    set data(text: string);
    get data(): string;
}
