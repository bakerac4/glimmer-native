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
import NativeElementNode from './NativeElementNode';
import TemplateElement from './TemplateElement';
function renderItem(wrapper, template, item) {
    // const component = GlimmerResolverDelegate.lookupComponent(template.args.name);
    // const compiled = component.compilable.compile(Application.context);
    const cursor = { element: wrapper, nextSibling: null };
    let componentInstance = Application._renderComponent(null, cursor, template.compiled, Object.assign(Object.assign({}, template.args), { item }));
    let nativeEl = wrapper.nativeView;
    nativeEl.__GlimmerComponent__ = componentInstance._meta.component;
    return nativeEl;
}
export default class ListViewElement extends NativeElementNode {
    constructor() {
        super('listview', ListView, null);
        this.template = null;
        this.numberViewsCreated = 0;
        this.templates = {};
        this.nativeView.on(ListView.itemLoadingEvent, (args) => {
            this.updateListItem(args);
        });
    }
    // getItemTemplateComponent(name): GlimmerComponent {
    //     if (this.templates[name]) {
    //         return this.templates[name];
    //     } else {
    //         const templateNode = this.childNodes.find((x) => {
    //             if (x instanceof TemplateElement && !name) {
    //                 return true;
    //             } else if (x instanceof TemplateElement && name) {
    //                 return x.component && x.component.args.key === name;
    //             } else {
    //                 return false;
    //             }
    //         }) as TemplateElement;
    //         if (templateNode) {
    //             let component = Compilable(templateNode.component.args.src);
    //             const compiled = component.compile(Application.context);
    //             this.templates[name] = {
    //                 compiled,
    //                 args: templateNode.component.args
    //             };
    //             return this.templates[name];
    //         } else {
    //             return null;
    //         }
    //     }
    // }
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
                let template;
                if (args.view && args.view.__GlimmerComponentBuilder__) {
                    console.info(`instantiating component in keyed view item at ${args.index}`);
                    args.view.__GlimmerComponentBuilder__(item);
                    args.view.__GlimmerComponentBuilder__ = null; // free the memory
                    return;
                }
                template = listView.itemTemplates.filter((x) => x.key == 'default')[0];
                if (!template) {
                    console.info(`Counldn't determine component to use for item at ${args.index}`);
                    return;
                }
                let wrapper = createElement('StackLayout');
                wrapper.setAttribute('id', `default-${this.numberViewsCreated}`);
                inTransaction(Application.aotRuntime.env, () => {
                    renderItem(wrapper, { compiled: template.component, args: template.args }, item);
                });
                args.view = wrapper.nativeView;
            }
            else {
                inTransaction(Application.aotRuntime.env, () => {
                    let componentInstance = args.view.__GlimmerComponent__;
                    const oldState = componentInstance.state.value();
                    // Update the state with the new item
                    componentInstance.update(Object.assign(Object.assign({}, oldState), { item }));
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
            console.info(`Adding template for key ${key}`);
            if (!this.nativeView.itemTemplates || typeof this.nativeView.itemTemplates == 'string') {
                this.nativeView.itemTemplates = [];
            }
            const keyedTemplate = new GlimmerKeyedTemplate(key, childNode);
            this.nativeView.itemTemplates = this.nativeView.itemTemplates.concat([keyedTemplate]);
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
        let component = Compilable(this._templateEl.component.args.src);
        const compiled = component.compile(Application.context);
        return compiled;
    }
    get args() {
        return this._templateEl.component.args;
    }
    get key() {
        return this._key;
    }
    createView() {
        //create a proxy element to eventually contain our item (once we have one to render)
        //TODO is StackLayout the best choice here?
        console.info(`creating view for key ${this.key}`);
        let wrapper = createElement('StackLayout');
        wrapper.setAttribute('id', `${this.key}-${this._index}`);
        let nativeEl = wrapper.nativeView;
        nativeEl.__GlimmerComponentBuilder__ = (props) => {
            inTransaction(Application.aotRuntime.env, () => {
                renderItem(wrapper, { compiled: this.component, args: this.args }, props);
            });
        };
        return nativeEl;
    }
}
