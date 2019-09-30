import { ListViewViewType, RadListView } from 'nativescript-ui-listview';
import Application from '../../..';
import { Compilable } from '../../glimmer/context';
import { createElement } from '../element-registry';
import NativeElementNode from './NativeElementNode';
import TemplateElement from './TemplateElement';
export default class RadListViewElement extends NativeElementNode {
    constructor() {
        super('radlistview', RadListView, null);
        let nativeView = this.nativeView;
        nativeView.itemViewLoader = (viewType) => this.loadView(viewType);
        this.nativeView.on(RadListView.itemLoadingEvent, (args) => {
            this.updateListItem(args);
        });
    }
    get itemTemplateComponent() {
        const templateNode = this.childNodes.find((x) => x instanceof TemplateElement);
        return templateNode ? templateNode.component : null;
    }
    loadView(viewType) {
        if (viewType === ListViewViewType.ItemView) {
            console.log('creating view for ', viewType);
            let wrapper = createElement('StackLayout');
            wrapper.setAttribute('class', 'list-view-item');
            const template = this.itemTemplateComponent;
            // const component = GlimmerResolverDelegate.lookupComponent(template.args.name);
            // const compiled = component.compilable.compile(Application.context);
            const cursor = { element: wrapper, nextSibling: null };
            let component = Compilable(template.args.src);
            const compiled = component.compile(Application.context);
            let componentInstance = Application._renderComponent(null, cursor, compiled, template.args);
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
            const oldState = componentInstance.state.value();
            // Update the state with the new item
            componentInstance.update(Object.assign({}, oldState, { item }));
        }
        else {
            console.log('got invalid update call with', args.index, args.view);
        }
    }
}
