import ViewNode from './ViewNode';

export default class TextNode extends ViewNode {
    text: any;
    constructor(text) {
        super();

        this.nodeType = 3;
        this.text = text;

        this._meta = {
            skipAddToDom: true
        }
        console.log(`created ${this}`)
    }

    setText(text) {
        this.text = text
        this.parentNode.setText(text)
    }
}
