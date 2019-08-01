import ElementNode from '../nodes/ElementNode';
export default class TemplateElement extends ElementNode {
    constructor() {
        super('template');
    }
    set component(value) {
        this.setAttribute('component', value);
    }
    get component() {
        return this.getAttribute('component');
    }
}
