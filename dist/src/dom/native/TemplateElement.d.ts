import ElementNode from '../nodes/ElementNode';
import ViewNode from '../nodes/ViewNode';
export default class TemplateElement extends ElementNode {
    component: any;
    key: null;
    constructor();
    insertBefore(childNode: ViewNode, referenceNode: ViewNode): void;
}
