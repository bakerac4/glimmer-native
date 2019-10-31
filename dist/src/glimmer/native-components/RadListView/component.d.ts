import Component from '@glimmer/component';
export interface Args {
    items: any;
    layout: any;
    keyedTemplates: any;
}
export default class RadListView extends Component<Args> {
    readonly keyedTemplates: any;
}
