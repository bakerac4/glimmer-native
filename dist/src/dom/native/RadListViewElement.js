import { ListViewViewType, RadListView } from 'nativescript-ui-listview';
import Application from '../../..';
import { Compilable } from '../../glimmer/context';
import { createElement } from '../element-registry';
import NativeElementNode from './NativeElementNode';
import TemplateElement from './TemplateElement';
export default class RadListViewElement extends NativeElementNode {
    constructor() {
        super('radlistview', RadListView, null);
        this.templates = {};
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
            return wrapper.nativeView;
            // let wrapper = createElement('StackLayout') as NativeElementNode;
            // wrapper.setAttribute('class', 'list-view-item');
            // const template = this.itemTemplateComponent as any;
            // // const component = GlimmerResolverDelegate.lookupComponent(template.args.name);
            // // const compiled = component.compilable.compile(Application.context);
            // const cursor = { element: wrapper, nextSibling: null } as Cursor;
            // let component = Compilable(template.args.src);
            // const compiled = component.compile(Application.context);
            // let componentInstance = Application._renderComponent(null, cursor, compiled, template.args);
            // let nativeEl = wrapper.nativeView;
            // (nativeEl as any).__GlimmerComponent__ = componentInstance._meta.component;
            // return nativeEl;
        }
        else if (viewType === ListViewViewType.HeaderView) {
            const template = this.getItemTemplateComponent('header');
            if (template) {
                let wrapper = createElement('StackLayout');
                wrapper.setAttribute('class', 'list-view-item');
                const view = this.renderItem(wrapper, template, {});
                return view;
            }
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
            componentInstance.update(Object.assign(Object.assign({}, oldState), { item }));
        }
        else if (args.view) {
            const templateSelector = this.nativeView.itemTemplateSelector;
            let name = null;
            if (templateSelector) {
                name = templateSelector({}, args.index, this.nativeView.items);
            }
            const template = this.getItemTemplateComponent(name);
            let wrapper = createElement('StackLayout');
            wrapper.setAttribute('class', 'list-view-item');
            const view = this.renderItem(wrapper, template, item);
            args.view = view;
        }
        else {
            console.log('got invalid update call with', args.index, args.view);
        }
    }
    getItemTemplateComponent(name) {
        if (this.templates[name]) {
            return this.templates[name];
        }
        else {
            const templateNode = this.childNodes.find((x) => {
                if (x instanceof TemplateElement && !name) {
                    return true;
                }
                else if (x instanceof TemplateElement && name) {
                    return x.component && x.component.args.key === name;
                }
                else {
                    return false;
                }
            });
            if (templateNode) {
                let component = Compilable(templateNode.component.args.src);
                const compiled = component.compile(Application.context);
                this.templates[name] = {
                    compiled,
                    args: templateNode.component.args
                };
                return this.templates[name];
            }
            else {
                return null;
            }
        }
    }
    renderItem(view, template, item) {
        // const component = GlimmerResolverDelegate.lookupComponent(template.args.name);
        // const compiled = component.compilable.compile(Application.context);
        const cursor = { element: view, nextSibling: null };
        let componentInstance = Application._renderComponent(null, cursor, template.compiled, Object.assign(Object.assign({}, template.args), { item }));
        let nativeEl = view.nativeView;
        nativeEl.__GlimmerComponent__ = componentInstance._meta.component;
        return nativeEl;
    }
}
