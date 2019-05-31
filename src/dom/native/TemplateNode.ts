import ElementNode from '../nodes/ElementNode';

export default class TemplateElement extends ElementNode {
    constructor() {
        super('template');
    }

    set component(value: any) {
        this.setAttribute('component', value);
    }

    get component(): any {
        return this.getAttribute('component');
    }
}
