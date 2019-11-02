import Component from '@glimmer/component';

// import ElementNode from '../src/dom/nodes/ElementNode';

export interface Args {
    keyedTemplates: any;
    items: any;
    layout: any;
    loaded: any;
}
export default class RadListView extends Component<Args> {
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
