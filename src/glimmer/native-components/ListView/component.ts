import Component from '@glimmer/component';

// import ElementNode from '../src/dom/nodes/ElementNode';

export default class ListView extends Component {
    item: any;

    constructor(owner, args) {
        super(owner, args);

        const element = this.element;
        // this.args.forEach(arg => {
        //     element._nativeView.set(arg)
        // });
    }
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
