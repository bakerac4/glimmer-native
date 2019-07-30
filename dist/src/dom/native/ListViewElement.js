import { ListView as NativeListView } from 'tns-core-modules/ui/list-view';
import Application from '../../..';
import GlimmerResolverDelegate from '../../glimmer/context';
import { createElement } from '../element-registry';
import NativeElementNode from './NativeElementNode';
export default class ListViewElement extends NativeElementNode {
    constructor() {
        super('listview', NativeListView, null);
        this.template = null;
        // const observerable = new ObservableArray(this.component.items);
        // this.items.addEventListener(Observable.propertyChangeEvent, (args) => {
        //     console.log('In event listener');
        // });
        this.nativeView.on(NativeListView.itemLoadingEvent, (args) => {
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
            wrapper.setAttribute('class', 'list-view-item');
            const component = GlimmerResolverDelegate.lookupComponent(this.template);
            const compiled = component.compilable.compile(Application.context);
            let componentInstance = Application._renderComponent(this.template, wrapper, null, compiled, { item });
            let nativeEl = wrapper.nativeView;
            nativeEl.__GlimmerComponent__ = componentInstance._meta.component;
            args.view = nativeEl;
        }
        else {
            let componentInstance = args.view.__GlimmerComponent__;
            let state = componentInstance.state;
            state.update({ item });
            componentInstance.runtime.env.begin();
            componentInstance.result.rerender();
            componentInstance.runtime.env.commit();
            // Application._rerender();
            // log.debug(`updating view for ${args.index} which is a ${args.view}`)
            // componentInstance.set({ item });
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
        return this.template;
    }
    get nativeView() {
        return super.nativeView;
    }
    set nativeView(view) {
        super.nativeView = view;
    }
}
