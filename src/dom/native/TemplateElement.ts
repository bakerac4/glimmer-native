import GlimmerComponent from '@glimmer/component/dist/types/addon/-private/component';

import ElementNode from '../nodes/ElementNode';

export default class TemplateElement extends ElementNode {
    constructor() {
        super('template');
    }

    set component(value: typeof GlimmerComponent) {
        this.setAttribute('component', value);
    }

    get component(): typeof GlimmerComponent {
        return this.getAttribute('component');
    }
}
