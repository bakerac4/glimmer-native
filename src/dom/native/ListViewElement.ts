// import GlimmerComponent from '@glimmer/component/dist/types/addon/-private/component';
import { Cursor } from '@glimmer/interfaces';
import { ItemEventData, ItemsSource, ListView as NativeListView } from 'tns-core-modules/ui/list-view';

import Application from '../../..';
import GlimmerResolverDelegate from '../../glimmer/context';
import { createElement } from '../element-registry';
import NativeElementNode from './NativeElementNode';

export default class ListViewElement extends NativeElementNode {
    template: any = null;
    items: any;

    constructor() {
        super('listview', NativeListView, null);
        this.nativeView.on(NativeListView.itemLoadingEvent, (args) => {
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
            //Create the wrapper element
            let wrapper = createElement('StackLayout') as NativeElementNode;
            wrapper.setAttribute('class', 'list-view-item');

            //Render the component with the passed in name into the wrapper element
            const component = GlimmerResolverDelegate.lookupComponent(this.template);
            const compiled = component.compilable.compile(Application.context);
            // const args = Object.assign({}, this.args, item);
            const cursor = { element: wrapper, nextSibling: null } as Cursor;
            let componentInstance = Application._renderComponent(this.template, cursor, compiled, item);
            // let componentInstance = Applicaton._renderWithCurriedComponentDefinition(this.template.inner.name, wrapper, null, compiled, this.template.inner.state)

            //set the view as the native element that was generated and pass the rendering results as the component
            let nativeEl = wrapper.nativeView;
            (nativeEl as any).__GlimmerComponent__ = componentInstance._meta.component;
            args.view = nativeEl;
        } else {
            //Get the component instance which we classify as the rendering result, runtime and state
            let componentInstance = (args.view as any).__GlimmerComponent__;
            let state = componentInstance.state;
            //Update the state with the new item
            state.update({ item });
            //and now tell glimmer to re-render
            componentInstance.runtime.env.begin();
            componentInstance.result.rerender();
            componentInstance.runtime.env.commit();
        }
    }

    get itemTemplateComponent() {
        return this.template;
    }

    get nativeView(): NativeListView {
        return super.nativeView as NativeListView;
    }

    set nativeView(view: NativeListView) {
        super.nativeView = view;
    }
}
