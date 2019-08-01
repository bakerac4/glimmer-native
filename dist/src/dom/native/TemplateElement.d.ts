import GlimmerComponent from '@glimmer/component/dist/types/addon/-private/component';
import ElementNode from '../nodes/ElementNode';
export default class TemplateElement extends ElementNode {
    constructor();
    component: typeof GlimmerComponent;
}
