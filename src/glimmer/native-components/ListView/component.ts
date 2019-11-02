import Component from '@glimmer/component';

// import ElementNode from '../src/dom/nodes/ElementNode';

export interface Args {
    items: any;
    keyedTemplates: [];
}
export default class ListView extends Component<Args> {
    // @action
    // get keyedTemplates(): any {
    //     const keyedTemplateNames = this.args.keyedTemplates;
    //     if (Array.isArray(keyedTemplateNames)) {
    //         return keyedTemplateNames.map((name) => {
    //             return new GlimmerKeyedTemplate(name);
    //         });
    //     } else {
    //         return [];
    //     }
    // }
}
