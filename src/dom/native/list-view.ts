import { ItemEventData, ItemsSource, ListView as NativeListView } from 'tns-core-modules/ui/list-view';

import NativeElementNode from './ElementNode';

export default class ListView extends NativeElementNode {
    template: any;
    yieldItem: (item) => {};

    constructor() {
        super('listview', NativeListView);

        this.nativeView.on(NativeListView.itemLoadingEvent, (args) => {
            this.updateListItem(args as ItemEventData, this.template);
        });
    }

    updateListItem(args: ItemEventData, template) {
        let item;
        let listView = this.nativeView as any;
        let items = listView.items;

        if (args.index >= items.length) {
            console.log(`Got request for item at index that didn't exist ${args.index}`);
            return;
        }

        if ((items as ItemsSource).getItem) {
            item = (items as ItemsSource).getItem(args.index);
        } else {
            item = (items as any)[args.index];
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

    // get itemTemplateComponent(): typeof SvelteComponent {
    //     const templateNode = this.childNodes.find((x) => x instanceof TemplateElement) as TemplateElement;
    //     return templateNode ? templateNode.component : null;
    // }

    // get nativeView(): ListView {
    //     return super.nativeView as ListView;
    // }

    // set nativeView(view: ListView) {
    //     super.nativeView = view;
    // }
}
