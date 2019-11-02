import ViewNode from './ViewNode';
export default class TextNode extends ViewNode {
    constructor(text) {
        super();
        this.nodeType = 3;
        this.text = text;
    }
    setText(text) {
        this.text = text;
        this.parentNode.setText(text);
    }
    set data(text) {
        this.setText(text);
    }
    get data() {
        return this.text;
    }
}
