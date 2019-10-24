import Component from '@glimmer/component';

import { GlimmerKeyedTemplate } from '../../../dom/native/ListViewElement';

// import ElementNode from '../src/dom/nodes/ElementNode';

export interface Args {
    items: any;
    keyedTemplates: [];
}
export default class ListView extends Component<Args> {
    // @action
    get keyedTemplates(): any {
        const keyedTemplateNames = this.args.keyedTemplates;
        return keyedTemplateNames.map((name) => {
            return new GlimmerKeyedTemplate(name);
        });
    }
}
