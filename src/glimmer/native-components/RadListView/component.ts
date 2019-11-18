import Component from '@glimmer/component';

// import ElementNode from '../src/dom/nodes/ElementNode';

export interface Args {
    items: any;
    layout: any;
    loaded: any;
}
export default class RadListView extends Component<Args> {}
