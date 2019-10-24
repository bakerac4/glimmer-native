import ElementNode from '../nodes/ElementNode';
import ViewNode from '../nodes/ViewNode';

export default class TemplateElement extends ElementNode {
    component = null;
    key: null;
    constructor() {
        super('template');
    }

    insertBefore(childNode: ViewNode, referenceNode: ViewNode) {
        super.insertBefore(childNode, referenceNode);
        // (this.parentNode as ListViewElement).registerTemplate(this.getAttribute('key'));
    }
}
