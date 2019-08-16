import Component from '@glimmer/component';
export interface Args {
    items: any;
    layout: any;
}
export default class RadListView extends Component<Args> {
    loaded(event: any): void;
}
