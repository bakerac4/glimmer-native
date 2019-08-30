import { ListViewViewType, RadListView } from 'nativescript-ui-listview';
import Application from '../../..';
import GlimmerResolverDelegate from '../../glimmer/context';
import { createElement } from '../element-registry';
import NativeElementNode from './NativeElementNode';
export default class RadListViewElement extends NativeElementNode {
    constructor() {
        super('radlistview', RadListView, null);
        let nativeView = this.nativeView;
        nativeView.itemViewLoader = (viewType) => this.loadView(viewType);
        this.nativeView.on(RadListView.itemLoadingEvent, (args) => {
            this.updateListItem(args);
        });
        // this.nativeView.on(RadListView.itemDeselectedEvent, (args) => {
        //     this.deselectListItem(args as ListViewEventData);
        // });
        this.nativeView.on(RadListView.itemSelectedEvent, (args) => {
            this.selectListItem(args);
        });
        this.lastItemSelected = null;
    }
    selectListItem(args) {
        let item;
        let listView = this.nativeView;
        let items = listView.items;
        if (args.index >= items.length) {
            console.log("Got request for item at index that didn't exists", items, args.index);
            return;
        }
        if (items.getItem) {
            item = items.getItem(args.index);
        }
        else {
            item = items[args.index];
        }
        if (args.view && args.view.__GlimmerComponent__) {
            if (this.lastItemSelected) {
                this.deselectListItem(this.lastItemSelected);
            }
            let componentInstance = args.view.__GlimmerComponent__;
            // Update the state with the new item
            componentInstance.update(Object.assign({}, item, { selected: true }));
            item.selected = true;
            this.lastItemSelected = args;
        }
        else {
            console.log('got invalid update call with', args.index, args.view);
        }
    }
    deselectListItem(args) {
        let item;
        let listView = this.nativeView;
        let items = listView.items;
        if (args.index >= items.length) {
            console.log("Got request for item at index that didn't exists", items, args.index);
            return;
        }
        if (items.getItem) {
            item = items.getItem(args.index);
        }
        else {
            item = items[args.index];
        }
        listView.deselectItemAt(args.index);
        if (args.view && args.view.__GlimmerComponent__) {
            const item = listView.getItemAtIndex(args.index);
            const viewForItem = listView.getViewForItem(item);
            //If the item is in view, update the item and re-render
            if (viewForItem) {
                let componentInstance = viewForItem.__GlimmerComponent__;
                // Update the state with the new item
                componentInstance.update(Object.assign({}, item, { selected: false }));
            }
            //otherwise just set the selected property so the next time its re-render its correct
            item.selected = false;
        }
        else {
            console.log('got invalid update call with', args.index, args.view);
        }
    }
    loadView(viewType) {
        if (viewType === ListViewViewType.ItemView) {
            console.log('creating view for ', viewType);
            let wrapper = createElement('StackLayout');
            const component = GlimmerResolverDelegate.lookupComponent(this.template);
            // let component = Compilable(`<${this.template} @model={{this.model}} />`);
            const compiled = component.compilable.compile(Application.context);
            let componentInstance = Application._renderComponent(this.template, wrapper, null, compiled);
            let nativeEl = wrapper.nativeView;
            nativeEl.__GlimmerComponent__ = componentInstance._meta.component;
            return nativeEl;
        }
    }
    updateListItem(args) {
        let item;
        let listView = this.nativeView;
        let items = listView.items;
        if (args.index >= items.length) {
            console.log("Got request for item at index that didn't exists", items, args.index);
            return;
        }
        if (items.getItem) {
            item = items.getItem(args.index);
        }
        else {
            item = items[args.index];
        }
        if (args.view && args.view.__GlimmerComponent__) {
            let componentInstance = args.view.__GlimmerComponent__;
            // Update the state with the new item
            componentInstance.update(item);
            // if (item.selected) {
            //     listView.selectItemAt(args.index);
            // }
        }
        else {
            console.log('got invalid update call with', args.index, args.view);
        }
    }
}
