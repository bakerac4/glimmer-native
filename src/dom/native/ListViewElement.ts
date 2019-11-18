// import GlimmerComponent from '@glimmer/component/dist/types/addon/-private/component';
import { Cursor } from '@glimmer/interfaces';
import { inTransaction } from '@glimmer/runtime/dist/modules/es2017/lib/environment';
import { View } from 'tns-core-modules/ui/core/view';
import { ItemEventData, ItemsSource, ListView } from 'tns-core-modules/ui/list-view';

import Application from '../../..';
import { Compilable } from '../../glimmer/context';
import { createElement } from '../element-registry';
import ViewNode from '../nodes/ViewNode';
import NativeElementNode from './NativeElementNode';
import TemplateElement from './TemplateElement';

function renderItem(wrapper, template, item) {
    // const component = GlimmerResolverDelegate.lookupComponent(template.args.name);
    // const compiled = component.compilable.compile(Application.context);
    const cursor = { element: wrapper, nextSibling: null } as Cursor;
    let componentInstance = Application._renderComponent(null, cursor, template.compiled, {
        ...template.args,
        item
    });

    let nativeEl = wrapper.nativeView;
    (nativeEl as any).__GlimmerComponent__ = componentInstance._meta.component;
    return nativeEl;
}

export default class ListViewElement extends NativeElementNode {
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
            let template: GlimmerKeyedTemplate;
            if (args.view && (args.view as any).__GlimmerComponentBuilder__) {
                console.info(
                    `instantiating component in keyed view item ${
                        (args.view as any).__GlimmerNativeElement__.id
                    } for item index ${args.index}`
                );
                (args.view as any).__GlimmerComponentBuilder__(item);
                (args.view as any).__GlimmerComponentBuilder__ = null; // free the memory
                return;
            }

            template = (listView as any).itemTemplates.filter((x) => x.key == 'default')[0];

            if (!template) {
                console.info(`Counldn't determine component to use for item at ${args.index}`);
                return;
            }

            let wrapper = createElement('StackLayout') as NativeElementNode;
            wrapper.setAttribute('id', `default-${this.numberViewsCreated}`);
            inTransaction(Application.aotRuntime.env, () => {
                renderItem(wrapper, { compiled: template.component, args: template.args }, item);
            });
            args.view = wrapper.nativeView;
        } else {
            inTransaction(Application.aotRuntime.env, () => {
                let componentInstance = (args.view as any).__GlimmerComponent__;
                const oldState = componentInstance.state.value();
                // Update the state with the new item
                componentInstance.update({
                    ...oldState,
                    item
                });
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
            console.info(`Adding template for key ${key}`);
            if (!this.nativeView.itemTemplates || typeof this.nativeView.itemTemplates == 'string') {
                this.nativeView.itemTemplates = [];
            }
            const keyedTemplate = new GlimmerKeyedTemplate(key, childNode);
            this.nativeView.itemTemplates = this.nativeView.itemTemplates.concat([keyedTemplate]);
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
    _component: number;

    constructor(key: string, templateEl: TemplateElement) {
        this._key = key;
        this._templateEl = templateEl;
        this._index = 0;
    }

    get component() {
        if (!this._component) {
            let component = Compilable(this._templateEl.component.args.src);
            const compiled = component.compile(Application.context);
            this._component = compiled;
        }
        return this._component;
    }

    get args() {
        return this._templateEl.component.args;
    }

    get key() {
        return this._key;
    }

    createView(): View {
        //create a proxy element to eventually contain our item (once we have one to render)
        //TODO is StackLayout the best choice here?
        console.info(`creating view for key ${this.key}`);
        let wrapper = createElement('StackLayout') as NativeElementNode;
        wrapper.setAttribute('id', `${this.key}-${this._index}`);
        let nativeEl = wrapper.nativeView;
        (nativeEl as any).__GlimmerComponentBuilder__ = (props: any) => {
            inTransaction(Application.aotRuntime.env, () => {
                renderItem(wrapper, { compiled: this.component, args: this.args }, props);
                this._index++;
            });
        };
        return nativeEl;
    }
}
