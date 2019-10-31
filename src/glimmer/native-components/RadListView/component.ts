import Component from '@glimmer/component';

import { GlimmerKeyedTemplate } from '../../../dom/native/ListViewElement';

// import ElementNode from '../src/dom/nodes/ElementNode';

export interface Args {
    items: any;
    layout: any;
    keyedTemplates: any;
}
export default class RadListView extends Component<Args> {
    get keyedTemplates(): any {
        const keyedTemplateNames = this.args.keyedTemplates;
        if (Array.isArray(keyedTemplateNames)) {
            return keyedTemplateNames.map((name) => {
                return new GlimmerKeyedTemplate(name);
            });
        } else {
            return [];
        }
    }
}
