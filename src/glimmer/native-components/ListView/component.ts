import Component from '@glimmer/component';

// import ElementNode from '../src/dom/nodes/ElementNode';

export interface Args {
    items: any;
}
export default class ListView extends Component<Args> {
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
