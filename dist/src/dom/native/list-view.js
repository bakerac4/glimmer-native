import { ListView as NativeListView } from 'tns-core-modules/ui/list-view';
import NativeElementNode from './ElementNode';
export default class ListView extends NativeElementNode {
    constructor() {
        super('listview', NativeListView);
        this.nativeView.on(NativeListView.itemLoadingEvent, (args) => {
            this.updateListItem(args, this.template);
        });
    }
    updateListItem(args, template) {
        let item;
        let listView = this.nativeView;
        let items = listView.items;
        if (args.index >= items.length) {
            console.log(`Got request for item at index that didn't exist ${args.index}`);
            return;
        }
        if (items.getItem) {
            item = items.getItem(args.index);
        }
        else {
            item = items[args.index];
        }
        if (!args.view) {
            // // Create label if it is not already created.
            this.yieldItem(item);
            // const count = template._nativeView.getChildrenCount();
            template._nativeView.eachChildView((view) => {
                view.item = item;
            });
            // template._nativeView.item = item;
            args.view = template._nativeView;
            args.view.className = 'list-group-item';
            // let nativeEl = wrapper.nativeView;
            // (nativeEl as any).__SvelteComponent__ = componentInstance;
            // args.view = nativeEl;
        }
        // const nativeView = this.nativeView as any;
        // (<any>args.view).text = nativeView.items[args.index].title;
        // (<any>args.view) = nativeView.items[args.index].title;
    }
}
