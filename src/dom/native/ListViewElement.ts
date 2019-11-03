// import GlimmerComponent from '@glimmer/component/dist/types/addon/-private/component';
import { inTransaction } from '@glimmer/runtime/dist/modules/es2017/lib/environment';
import { View } from 'tns-core-modules/ui/core/view';
import { ItemEventData, ItemsSource, ListView } from 'tns-core-modules/ui/list-view';

import Application from '../../..';
import { createElement } from '../element-registry';
import ViewNode from '../nodes/ViewNode';
import NativeViewElementNode from './NativeViewElementNode';
import TemplateElement from './TemplateElement';

export default class ListViewElement extends NativeViewElementNode<ListView> {
    template: any = null;
    items: any;
    numberViewsCreated: number = 0;
    templates = {};

    constructor() {
        super('listview', ListView, null);
        this.nativeView.on(ListView.itemLoadingEvent, (args) => {
            this.updateListItem(args as ItemEventData);
        });
    }

    async updateListItem(args: ItemEventData) {
        let item;
        let listView = this.nativeView;
        let items = listView.items;

        if (args.index >= items.length) {
            // console.log(`Got request for item at index that didn't exist ${args.index}`);
            return;
        }

        if ((items as ItemsSource).getItem) {
            item = (items as ItemsSource).getItem(args.index);
        } else {
            item = (items as any)[args.index];
        }

        if (!args.view || !(args.view as any).__GlimmerComponent__) {
            let component;
            if (args.view && (args.view as any).__GlimmerComponentBuilder__) {
                // console.debug(`instantiating component in keyed view item at ${args.index}`);
                (args.view as any).__GlimmerComponentBuilder__(item);
                // (args.view as any).__GlimmerComponent__ = true;
                (args.view as any).__GlimmerComponentBuilder__ = null; // free the memory
                return;
            }

            // console.debug(`creating default view for item at ${args.index}`);
            // if (typeof listView.itemTemplateSelector === 'function' && typeof listView.itemTemplates === 'object') {
            //     let key = listView.itemTemplateSelector(item, args.index, listView.items);
            //     component = listView.itemTemplates
            //         .filter((x) => x.key === key)
            //         .map((x) => (x as GlimmerKeyedTemplate).component)[0];
            // } else
            component = (listView as any)._itemTemplates
                .filter((x) => x.key == 'default')
                .map((x) => (x as GlimmerKeyedTemplate).component)[1];

            if (!component) {
                // console.error(`Counldn't determine component to use for item at ${args.index}`);
                return;
            }

            let wrapper = createElement('StackLayout') as NativeViewElementNode<View>;
            wrapper.setAttribute('id', `default-${this.numberViewsCreated}`);
            inTransaction(Application.aotRuntime.env, () => {
                Application.addListItem({
                    id: `default-${this.numberViewsCreated}`,
                    node: wrapper,
                    template: component.args.src,
                    item
                });
                const oldState = Application.state.value();
                Application.state.forceUpdate({
                    ...oldState,
                    listViewItems: [...Application.listItems]
                });
                Application.result.rerender();
                this.numberViewsCreated = this.numberViewsCreated + 1;
            });

            let nativeEl = wrapper.nativeView;
            (nativeEl as any).__GlimmerComponent__ = true;
            args.view = nativeEl;
        } else {
            // console.debug(`updating view for ${args.index} which is a ${args.view}`);
            const items = Application.listItems;
            const listItem = items.find((item) => item.id === args.view.id);
            listItem.item = item;
            inTransaction(Application.aotRuntime.env, () => {
                const oldState = Application.state.value();
                Application.state.forceUpdate({
                    ...oldState,
                    listViewItems: [...Application.listItems]
                });
                Application.result.rerender();
            });
        }
    }

    get nativeView(): ListView {
        return super.nativeView as ListView;
    }

    set nativeView(view: ListView) {
        super.nativeView = view;
    }

    onInsertedChild(childNode: ViewNode, index: number) {
        super.onInsertedChild(childNode, index);
        if (childNode instanceof TemplateElement) {
            let key = childNode.getAttribute('key') || 'default';
            // console.debug(`Adding template for key ${key}`);
            if (!this.nativeView.itemTemplates || typeof this.nativeView.itemTemplates == 'string') {
                this.nativeView.itemTemplates = [];
            }
            const keyedTemplate = new GlimmerKeyedTemplate(key, childNode);
            this.nativeView.itemTemplates = this.nativeView.itemTemplates.concat([keyedTemplate]);
            // (this.nativeView as any)._itemTemplatesInternal.push(keyedTemplate);
        }
    }

    onRemovedChild(childNode: ViewNode) {
        super.onRemovedChild(childNode);
        if (childNode instanceof TemplateElement) {
            let key = childNode.getAttribute('key') || 'default';
            if (this.nativeView.itemTemplates && typeof this.nativeView.itemTemplates != 'string') {
                this.nativeView.itemTemplates = this.nativeView.itemTemplates.filter((t) => t.key != key);
            }
        }
    }
}
export class GlimmerKeyedTemplate {
    _key: string;
    _templateEl: TemplateElement;
    _index: number;

    constructor(key: string, templateEl: TemplateElement) {
        this._key = key;
        this._templateEl = templateEl;
        this._index = 0;
    }

    get component() {
        return this._templateEl.component;
    }

    get key() {
        return this._key;
    }

    createView(): View {
        //create a proxy element to eventually contain our item (once we have one to render)
        //TODO is StackLayout the best choice here?
        // console.debug(`creating view for key ${this.key}`);
        let wrapper = createElement('StackLayout') as NativeViewElementNode<View>;
        wrapper.setAttribute('id', `${this.key}-${this._index}`);
        let nativeEl = wrapper.nativeView;
        (nativeEl as any).__GlimmerComponentBuilder__ = (props: any) => {
            inTransaction(Application.aotRuntime.env, () => {
                const item = {
                    id: `${this.key}-${this._index}`,
                    node: wrapper,
                    template: this.component.args.src,
                    item: props
                };
                Application.addListItem(item);
                const oldState = Application.state.value();
                Application.state.forceUpdate({
                    ...oldState,
                    listViewItems: [...Application.listItems]
                });
                Application.result.rerender();
                this._index++;
                (nativeEl as any).__GlimmerComponent__ = item;
            });
        };
        return nativeEl;
    }
}
