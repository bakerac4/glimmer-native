import ElementNode from '../nodes/ElementNode';
export default class TemplateElement extends ElementNode {
    constructor() {
        super('template');
        this.component = null;
    }
    insertBefore(childNode, referenceNode) {
        super.insertBefore(childNode, referenceNode);
        // (this.parentNode as ListViewElement).registerTemplate(this.getAttribute('key'));
    }
}
