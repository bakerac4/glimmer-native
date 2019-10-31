import GlimmerComponent from '@glimmer/component/dist/types/addon/-private/component';
import { Cursor } from '@glimmer/interfaces';
import { ListViewEventData, ListViewViewType, RadListView } from 'nativescript-ui-listview';
import { View } from 'tns-core-modules/ui/core/view/view';

import Application from '../../..';
import GlimmerResolverDelegate, { Compilable } from '../../glimmer/context';
import { createElement } from '../element-registry';
import NativeElementNode from './NativeElementNode';
import TemplateElement from './TemplateElement';

export default class RadListViewElement extends NativeElementNode {
    nativeView: RadListView;
    lastItemSelected: any;
    component: any;
    templates = {};
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

            let wrapper = createElement('StackLayout') as NativeElementNode;
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
        } else if (viewType === ListViewViewType.HeaderView) {
            const template = this.getItemTemplateComponent('header') as any;
            if (template) {
                let wrapper = createElement('StackLayout') as NativeElementNode;
                wrapper.setAttribute('class', 'list-view-item');
                const view = this.renderItem(wrapper, template, {});
                return view;
            }
        }
    }

    updateListItem(args: ListViewEventData) {
        let item;
        let listView = this.nativeView;
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
        } else if (args.view) {
            const templateSelector = this.nativeView.itemTemplateSelector as any;
            let name = null;
            if (templateSelector) {
                name = templateSelector({}, args.index, this.nativeView.items);
            }
            const template = this.getItemTemplateComponent(name) as any;
            let wrapper = createElement('StackLayout') as NativeElementNode;
            wrapper.setAttribute('class', 'list-view-item');
            const view = this.renderItem(wrapper, template, item);
            args.view = view;
        } else {
            console.log('got invalid update call with', args.index, args.view);
        }
    }

    getItemTemplateComponent(name): GlimmerComponent {
        if (this.templates[name]) {
            return this.templates[name];
        } else {
            const templateNode = this.childNodes.find((x) => {
                if (x instanceof TemplateElement && !name) {
                    return true;
                } else if (x instanceof TemplateElement && name) {
                    return x.component && x.component.args.key === name;
                } else {
                    return false;
                }
            }) as TemplateElement;
            if (templateNode) {
                let component = Compilable(templateNode.component.args.src);
                const compiled = component.compile(Application.context);
                this.templates[name] = {
                    compiled,
                    args: templateNode.component.args
                };
                return this.templates[name];
            } else {
                return null;
            }
        }
    }

    renderItem(view, template, item) {
        // const component = GlimmerResolverDelegate.lookupComponent(template.args.name);
        // const compiled = component.compilable.compile(Application.context);
        const cursor = { element: view, nextSibling: null } as Cursor;
        let componentInstance = Application._renderComponent(null, cursor, template.compiled, {
            ...template.args,
            item
        });

        let nativeEl = view.nativeView;
        (nativeEl as any).__GlimmerComponent__ = componentInstance._meta.component;
        return nativeEl;
    }
}
