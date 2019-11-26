import GlimmerComponent from '@glimmer/component/dist/types/addon/-private/component';
import ElementNode from '../nodes/ElementNode';
export default class TemplateElement extends ElementNode {
    constructor();
    set component(value: GlimmerComponent<{
        src: string;
    }>);
    get component(): GlimmerComponent<{
        src: string;
    }>;
}
