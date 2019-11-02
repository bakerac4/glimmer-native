var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { inTransaction } from '@glimmer/runtime/dist/modules/es2017/lib/environment';
import { ListView } from 'tns-core-modules/ui/list-view';
import Application from '../../..';
import { Compilable } from '../../glimmer/context';
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
                console.log(`Got request for item at index that didn't exist ${args.index}`);
                return;
            }
            if (items.getItem) {
                item = items.getItem(args.index);
            }
            else {
                item = items[args.index];
            }
            if (!args.view && !args.view.__GlimmerComponent__) {
                let component;
                if (args.view && args.view.__GlimmerComponentBuilder__) {
                    console.debug(`instantiating component in keyed view item at ${args.index}`);
                    args.view.__GlimmerComponentBuilder__({ item });
                    args.view.__GlimmerComponentBuilder__ = null; // free the memory
                    return;
                }
                console.debug(`creating default view for item at ${args.index}`);
                if (typeof listView.itemTemplates == 'object') {
                    component = listView.itemTemplates
                        .filter((x) => x.key == 'default')
                        .map((x) => x.component)[0];
                }
                if (!component) {
                    console.error(`Counldn't determine component to use for item at ${args.index}`);
                    return;
                }
                let wrapper = createElement('StackLayout');
                inTransaction(Application.aotRuntime.env, () => {
                    Application.addListItem({
                        id: `listViewItem${this.numberViewsCreated}`,
                        node: wrapper,
                        template: component.args.src,
                        item
                    });
                    const oldState = Application.state.value();
                    Application.state.forceUpdate(Object.assign(Object.assign({}, oldState), { listViewItems: [...Application.listItems] }));
                    Application.result.rerender();
                });
                let nativeEl = wrapper.nativeView;
                args.view = nativeEl;
            }
            else {
                console.debug(`updating view for ${args.index} which is a ${args.view}`);
                const listItem = Application.listItems.find((item) => item.id === args.view.id);
                listItem.item = item;
                inTransaction(Application.aotRuntime.env, () => {
                    const oldState = Application.state.value();
                    Application.state.forceUpdate(Object.assign(Object.assign({}, oldState), { listViewItems: [...Application.listItems] }));
                    Application.result.rerender();
                });
            }
            //     //Create the wrapper element
            //     let wrapper = createElement('StackLayout') as NativeElementNode;
            //     wrapper.setAttribute('class', 'list-view-item');
            //     wrapper.setAttribute('id', `listViewItem${this.numberViewsCreated}`);
            //     const templateSelector = listView.itemTemplateSelector as any;
            //     let name = null;
            //     if (templateSelector) {
            //         name = templateSelector(item, args.index, listView.items);
            //     }
            //     const template = this.getItemTemplateComponent(name) as any;
            //     Application.addListItem({
            //         id: `listViewItem${this.numberViewsCreated}`,
            //         node: wrapper,
            //         template: template.args.src,
            //         item
            //     });
            //     this.numberViewsCreated = this.numberViewsCreated + 1;
            //     inTransaction(Application.aotRuntime.env, () => {
            //         const oldState = Application.state.value();
            //         Application.state.forceUpdate({
            //             ...oldState,
            //             listViewItems: [...Application.listItems]
            //         });
            //         Application.result.rerender();
            //     });
            //     args.view = wrapper.nativeView;
            // } else {
            //     const listItem = Application.listItems.find((item) => item.id === args.view.id);
            //     listItem.item = item;
            //     inTransaction(Application.aotRuntime.env, () => {
            //         const oldState = Application.state.value();
            //         Application.state.forceUpdate({
            //             ...oldState,
            //             listViewItems: [...Application.listItems]
            //         });
            //         Application.result.rerender();
            //     });
            // }
        });
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
            console.debug(`Adding template for key ${key}`);
            if (!this.nativeView.itemTemplates || typeof this.nativeView.itemTemplates == 'string') {
                this.nativeView.itemTemplates = [];
            }
            this.nativeView.itemTemplates.push(new GlimmerKeyedTemplate(key, childNode));
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
        console.debug(`creating view for key ${this.key}`);
        let wrapper = createElement('StackLayout');
        let nativeEl = wrapper.nativeView;
        nativeEl.__GlimmerComponentBuilder__ = (props) => {
            inTransaction(Application.aotRuntime.env, () => {
                Application.addListItem({
                    id: this.key,
                    node: wrapper,
                    template: this.component.args.src,
                    item: props
                });
                const oldState = Application.state.value();
                Application.state.forceUpdate(Object.assign(Object.assign({}, oldState), { listViewItems: [...Application.listItems] }));
                Application.result.rerender();
            });
        };
        return nativeEl;
    }
}
