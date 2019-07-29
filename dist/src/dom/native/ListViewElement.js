// import GlimmerComponent from '@glimmer/component/dist/types/addon/-private/component';
import { ListView as NativeListView } from 'tns-core-modules/ui/list-view';
import { createElement } from '../element-registry';
import NativeElementNode from './NativeElementNode';
import TemplateElement from './TemplateElement';
export default class ListViewElement extends NativeElementNode {
    constructor() {
        super('listview', NativeListView, null);
        this._nativeView.on(NativeListView.itemLoadingEvent, (args) => {
            this.updateListItem(args);
        });
    }
    updateListItem(args) {
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
        if (!args.view || !args.view.__GlimmerComponent__) {
            // log.debug(`creating view for item at ${args.index}`)
            let wrapper = createElement('StackLayout');
            let componentInstance = new this.itemTemplateComponent(null, {
                target: wrapper,
                intro: true,
                props: {
                    item
                }
            });
            let nativeEl = wrapper.nativeView;
            nativeEl.__GlimmerComponent__ = componentInstance;
            args.view = nativeEl;
        }
        else {
            let componentInstance = args.view.__GlimmerComponent__;
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
        const templateNode = this.childNodes.find((x) => x instanceof TemplateElement);
        return templateNode ? templateNode.component : null;
    }
    get nativeView() {
        return super.nativeView;
    }
    set nativeView(view) {
        super.nativeView = view;
    }
}
