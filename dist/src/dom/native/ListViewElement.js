var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// import GlimmerComponent from '@glimmer/component/dist/types/addon/-private/component';
import { inTransaction } from '@glimmer/runtime/dist/modules/es2017/lib/environment';
import { ListView } from 'tns-core-modules/ui/list-view';
import Application from '../../..';
import { createElement } from '../element-registry';
import NativeViewElementNode from './NativeViewElementNode';
import TemplateElement from './TemplateElement';
export default class ListViewElement extends NativeViewElementNode {
    constructor() {
        super('listview', ListView, null);
        this.template = null;
        this.numberViewsCreated = 0;
        this.templates = {};
        this.nativeView.on(ListView.itemLoadingEvent, (args) => {
            this.updateListItem(args);
        });
    }
    updateListItem(args) {
        return __awaiter(this, void 0, void 0, function* () {
            let item;
            let listView = this.nativeView;
            let items = listView.items;
            if (args.index >= items.length) {
                // console.log(`Got request for item at index that didn't exist ${args.index}`);
                return;
            }
            if (items.getItem) {
                item = items.getItem(args.index);
            }
            else {
                item = items[args.index];
            }
            if (!args.view || !args.view.__GlimmerComponent__) {
                let component;
                if (args.view && args.view.__GlimmerComponentBuilder__) {
                    // console.debug(`instantiating component in keyed view item at ${args.index}`);
                    args.view.__GlimmerComponentBuilder__(item);
                    // (args.view as any).__GlimmerComponent__ = true;
                    args.view.__GlimmerComponentBuilder__ = null; // free the memory
                    return;
                }
                // console.debug(`creating default view for item at ${args.index}`);
                // if (typeof listView.itemTemplateSelector === 'function' && typeof listView.itemTemplates === 'object') {
                //     let key = listView.itemTemplateSelector(item, args.index, listView.items);
                //     component = listView.itemTemplates
                //         .filter((x) => x.key === key)
                //         .map((x) => (x as GlimmerKeyedTemplate).component)[0];
                // } else
                component = listView._itemTemplates
                    .filter((x) => x.key == 'default')
                    .map((x) => x.component)[1];
                if (!component) {
                    // console.error(`Counldn't determine component to use for item at ${args.index}`);
                    return;
                }
                let wrapper = createElement('StackLayout');
                wrapper.setAttribute('id', `default-${this.numberViewsCreated}`);
                inTransaction(Application.aotRuntime.env, () => {
                    Application.addListItem({
                        id: `default-${this.numberViewsCreated}`,
                        node: wrapper,
                        template: component.args.src,
                        item
                    });
                    const oldState = Application.state.value();
                    Application.state.forceUpdate(Object.assign(Object.assign({}, oldState), { listViewItems: [...Application.listItems] }));
                    Application.result.rerender();
                    this.numberViewsCreated = this.numberViewsCreated + 1;
                });
                let nativeEl = wrapper.nativeView;
                nativeEl.__GlimmerComponent__ = true;
                args.view = nativeEl;
            }
            else {
                // console.debug(`updating view for ${args.index} which is a ${args.view}`);
                const items = Application.listItems;
                const listItem = items.find((item) => item.id === args.view.id);
                listItem.item = item;
                inTransaction(Application.aotRuntime.env, () => {
                    const oldState = Application.state.value();
                    Application.state.forceUpdate(Object.assign(Object.assign({}, oldState), { listViewItems: [...Application.listItems] }));
                    Application.result.rerender();
                });
            }
        });
    }
    get nativeView() {
        return super.nativeView;
    }
    set nativeView(view) {
        super.nativeView = view;
    }
    onInsertedChild(childNode, index) {
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
    onRemovedChild(childNode) {
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
    constructor(key, templateEl) {
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
    createView() {
        //create a proxy element to eventually contain our item (once we have one to render)
        //TODO is StackLayout the best choice here?
        // console.debug(`creating view for key ${this.key}`);
        let wrapper = createElement('StackLayout');
        wrapper.setAttribute('id', `${this.key}-${this._index}`);
        let nativeEl = wrapper.nativeView;
        nativeEl.__GlimmerComponentBuilder__ = (props) => {
            inTransaction(Application.aotRuntime.env, () => {
                const item = {
                    id: `${this.key}-${this._index}`,
                    node: wrapper,
                    template: this.component.args.src,
                    item: props
                };
                Application.addListItem(item);
                const oldState = Application.state.value();
                Application.state.forceUpdate(Object.assign(Object.assign({}, oldState), { listViewItems: [...Application.listItems] }));
                Application.result.rerender();
                this._index++;
                nativeEl.__GlimmerComponent__ = item;
            });
        };
        return nativeEl;
    }
}
