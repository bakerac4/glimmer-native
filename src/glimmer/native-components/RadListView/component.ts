import Component from '@glimmer/component';

import { action } from '../../decorators/action';

// import ElementNode from '../src/dom/nodes/ElementNode';

export interface Args {
    items: any;
    layout: any;
    loaded: any;
}
export default class RadListView extends Component<Args> {
    @action
    loaded(event) {
        // this.args.loaded(event);
        const view = event.object;
        const keys = Object.keys(this.args);
        const nativeKeys = keys.filter((item) => item.startsWith('native'));
        nativeKeys.forEach((key) => {
            const actualKey = key.split(':')[1];
            view[actualKey] = this.args[key];
        });
        // return true;
    }
    // public loadingEvent = NativeListView.itemLoadingEvent;
    // itemsObservable: any;
    // // constructor(owner, args) {
    // //     super(owner, args);
    // //     this.itemsObservable = fromObject({
    // //         items: this.args.items
    // //     });
    // // }
    // onItemLoading() {}
    // item: any;
    // constructor(owner, args) {
    //     super(owner, args);
    //     const element = this.bounds.firstNode as any;
    //     const items = args.items as any;
    //     element.nativeView.set('items', items);
    //     // this.args.forEach(arg => {
    //     //     element._nativeView.set(arg)
    //     // });
    // }
    // @tracked
    // args
    // didInsertElement() {
    //     const element:ViewNode = this.element as any;
    //     this.args.forEach(arg => {
    //         element._nativeView.set(arg)
    //     });
    //     console.log(this);
    // }
    // yieldItem(item) {
    //     this.item = item;
    // }
    // didInsertElement() {
    //     console.log(this);
    // }
}
