import Component from '@glimmer/component';

export default class ListView extends Component {
    event: 'itemLoading';
    // updateListItem(args: ItemEventData) {
    //     if (!args.view) {
    //         // Create label if it is not already created.
    //         args.view = new NativeLabel();
    //         args.view.className = 'list-group-item';
    //     }
    //     const nativeView = this.nativeView as any;
    //     (<any>args.view).text = nativeView.items[args.index].title;
    // }
}
