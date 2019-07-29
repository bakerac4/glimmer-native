// import GlimmerComponent from '@glimmer/component/dist/types/addon/-private/component';
import { ItemEventData, ItemsSource, ListView as NativeListView } from 'tns-core-modules/ui/list-view';

import { createElement } from '../element-registry';
import NativeElementNode from './NativeElementNode';
import TemplateElement from './TemplateElement';

export default class ListViewElement extends NativeElementNode {
    template: any;
    yieldItem: (item) => {};

    constructor() {
        super('listview', NativeListView, null);

        this._nativeView.on(NativeListView.itemLoadingEvent, (args) => {
            this.updateListItem(args as ItemEventData);
        });
    }

    updateListItem(args: ItemEventData) {
        let item;
        let listView = this.nativeView;
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

        if (!args.view || !(args.view as any).__GlimmerComponent__) {
            // log.debug(`creating view for item at ${args.index}`)
            let wrapper = createElement('StackLayout') as NativeElementNode;
            let componentInstance = new this.itemTemplateComponent(null, {
                target: wrapper,
                intro: true,
                props: {
                    item
                }
            });

            let nativeEl = wrapper.nativeView;
            (nativeEl as any).__GlimmerComponent__ = componentInstance;
            args.view = nativeEl;
        } else {
            let componentInstance = (args.view as any).__GlimmerComponent__;
            // log.debug(`updating view for ${args.index} which is a ${args.view}`)
            componentInstance.set({ item });
        }

        // if (!args.view) {
        //     // // Create label if it is not already created.
        //     this.yieldItem(item);
        //     // const count = template._nativeView.getChildrenCount();
        //     template._nativeView.eachChildView((view) => {
        //         view.item = item;
        //     });
        //     // template._nativeView.item = item;
        //     args.view = template._nativeView;
        //     args.view.className = 'list-group-item';

        //     // let nativeEl = wrapper.nativeView;
        //     // (nativeEl as any).__SvelteComponent__ = componentInstance;
        //     // args.view = nativeEl;
        // }
        // const nativeView = this.nativeView as any;
        // (<any>args.view).text = nativeView.items[args.index].title;
        // (<any>args.view) = nativeView.items[args.index].title;
    }

    get itemTemplateComponent() {
        const templateNode = this.childNodes.find((x) => x instanceof TemplateElement) as TemplateElement;
        return templateNode ? templateNode.component : null;
    }

    get nativeView(): NativeListView {
        return super.nativeView as NativeListView;
    }

    set nativeView(view: NativeListView) {
        super.nativeView = view;
    }
}
