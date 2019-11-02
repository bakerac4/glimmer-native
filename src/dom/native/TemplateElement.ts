import GlimmerComponent from '@glimmer/component/dist/types/addon/-private/component';

import ElementNode from '../nodes/ElementNode';

export default class TemplateElement extends ElementNode {
    constructor() {
        super('template');
    }

    set component(value: GlimmerComponent<{ src: string }>) {
        this.setAttribute('component', value);
    }

    get component(): GlimmerComponent<{ src: string }> {
        return this.getAttribute('component');
    }
}
