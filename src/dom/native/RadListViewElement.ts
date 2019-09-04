import { ListViewEventData, ListViewViewType, RadListView } from 'nativescript-ui-listview';
import { View } from 'tns-core-modules/ui/core/view/view';

import Application from '../../..';
import GlimmerResolverDelegate, { Compilable } from '../../glimmer/context';
import { createElement } from '../element-registry';
import NativeElementNode from './NativeElementNode';

export default class RadListViewElement extends NativeElementNode {
    lastItemSelected: any;
    component: any;
    constructor() {
        super('radlistview', RadListView, null);

        let nativeView = this.nativeView as RadListView;

        nativeView.itemViewLoader = (viewType: any): View => this.loadView(viewType);
        this.nativeView.on(RadListView.itemLoadingEvent, (args) => {
            this.updateListItem(args as ListViewEventData);
        });
    }

    loadView(viewType: string): View {
        if (viewType === ListViewViewType.ItemView) {
            console.log('creating view for ', viewType);
            let wrapper = createElement('StackLayout') as NativeElementNode;
            // const component = GlimmerResolverDelegate.lookupComponent(this.template);
            let component = Compilable(`<${this.template} @item={{this.item}} />`);
            const compiled = component.compile(Application.context);
            let componentInstance = Application._renderComponent(this.template, wrapper, null, compiled);

            let nativeEl = wrapper.nativeView;
            (nativeEl as any).__GlimmerComponent__ = componentInstance._meta.component;
            return nativeEl;
        }
    }

    updateListItem(args: ListViewEventData) {
        let item;
        let listView = this.nativeView as RadListView;
        let items = listView.items;

        if (args.index >= items.length) {
            console.log("Got request for item at index that didn't exists", items, args.index);
            return;
        }

        if (items.getItem) {
            item = items.getItem(args.index);
        } else {
            item = items[args.index];
        }

        if (args.view && (args.view as any).__GlimmerComponent__) {
            let componentInstance = (args.view as any).__GlimmerComponent__;
            // Update the state with the new item
            componentInstance.update({
                item
            });
        } else {
            console.log('got invalid update call with', args.index, args.view);
        }
    }
}
