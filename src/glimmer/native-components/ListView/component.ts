import Component from '@glimmer/component';

export default class ListView extends Component {
    item: any;
    // @tracked
    // args

    // didInsertElement() {
    //     const element:ViewNode = this.element as any;
    //     this.args.forEach(arg => {
    //         element._nativeView.set(arg)
    //     });
    //     console.log(this);
    // }
    yieldItem(item) {
        this.item = item;
    }
    didInsertElement() {
        console.log(this);
    }
}
