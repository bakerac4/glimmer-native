import GlimmerComponent from '@glimmer/component/dist/types/addon/-private/component';
import { ListViewEventData, ListViewViewType, RadListView } from 'nativescript-ui-listview';
import { View } from 'tns-core-modules/ui/core/view/view';

import Application from '../../../';
import { createElement } from '../element-registry';
import NativeElementNode from './NativeElementNode';
import TemplateElement from './TemplateElement';

export default class RadListViewElement extends NativeElementNode {
    lastItemSelected: any;
    component: any;
    items = [];
    constructor() {
        super('radlistview', RadListView, null);

        let nativeView = this.nativeView as RadListView;

        nativeView.itemViewLoader = (viewType: any): View => this.loadView(viewType);
        this.nativeView.on(RadListView.itemLoadingEvent, (args) => {
            this.updateListItem(args as ListViewEventData);
        });
    }

    get itemTemplateComponent(): GlimmerComponent {
        const templateNode = this.childNodes.find((x) => x instanceof TemplateElement) as TemplateElement;
        return templateNode ? templateNode.component : null;
    }

    loadView(viewType: string): View {
        if (viewType === ListViewViewType.ItemView) {
            console.log('creating view for ', viewType);
            // const template = this.itemTemplateComponent as any;
            let wrapper = createElement('StackLayout') as NativeElementNode;
            wrapper.setAttribute('id', `list-view-${this.items.length}`);
            wrapper.setAttribute('class', 'list-view-item');

            let nativeEl = wrapper.nativeView;
            let template = this.itemTemplateComponent as any;
            this.items.push(wrapper);
            Application.addListItem({ id: this.items.length, node: wrapper, template: template.args.src });
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
            const oldState = componentInstance.state.value();
            // Update the state with the new item
            componentInstance.update({
                ...oldState,
                item
            });
            // const pageNode = Application.renderedPage;
            // const oldState = pageNode._meta.nativeComponentResult.state.value();
            // Application.renderedPage._meta.nativeComponentResult.update({
            //     ...oldState,
            //     item
            // });
            // Application._rerender();
        } else {
            console.log('got invalid update call with', args.index, args.view);
        }
    }
}
