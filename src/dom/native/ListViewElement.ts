// import GlimmerComponent from '@glimmer/component/dist/types/addon/-private/component';
import GlimmerComponent from '@glimmer/component/dist/types/addon/-private/component';
import { Cursor } from '@glimmer/interfaces';
import { artifacts } from '@glimmer/program';
import { State } from '@glimmer/reference';
import { AotRuntime, renderAot, renderSync } from '@glimmer/runtime';
import { inTransaction } from '@glimmer/runtime/dist/modules/es2017/lib/environment';
import { ItemEventData, ItemsSource, ListView as NativeListView, ListView } from 'tns-core-modules/ui/list-view';
import { KeyedTemplate } from 'tns-core-modules/ui/page/page';

import Application, { ElementNode } from '../../..';
import { Compilable } from '../../glimmer/context';
import NativeComponentResult from '../../glimmer/result';
import { createElement } from '../element-registry';
import NativeElementNode from './NativeElementNode';
import TemplateElement from './TemplateElement';

export default class ListViewElement extends NativeElementNode {
    template: any = null;
    items: any;
    numberViewsCreated: number = 0;
    templates = {};

    constructor() {
        super('listview', NativeListView, null);
        // this.nativeView.on(NativeListView.loadedEvent, (args) => {
        //     this.setAttribute('_itemTemplatesInternal', this.getKeyedTemplates());
        // });
        this.nativeView.on(NativeListView.itemLoadingEvent, (args) => {
            this.updateListItem(args as ItemEventData);
        });
    }

    registerTemplate(name = 'default') {
        // this.templates.push(new GlimmerKeyedTemplate(name));
        this.setAttribute('_itemTemplatesInternal', this.templates);
    }

    renderItem(template, item) {
        let wrapper = createElement('StackLayout') as NativeElementNode;
        wrapper.setAttribute('class', 'list-view-item');

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

    async updateListItem(args: ItemEventData) {
        let item;
        let listView = this.nativeView;
        let items = listView.items;

        if (args.index >= items.length) {
            console.log(`Got request for item at index that didn't exist ${args.index}`);
            return;
        }

        if ((items as ItemsSource).getItem) {
            item = (items as ItemsSource).getItem(args.index);
        } else {
            item = (items as any)[args.index];
        }

        if (!args.view) {
            //Create the wrapper element
            let wrapper = createElement('StackLayout') as NativeElementNode;
            wrapper.setAttribute('class', 'list-view-item');
            wrapper.setAttribute('id', `listViewItem${this.numberViewsCreated}`);

            // //Render the component with the passed in name into the wrapper element
            // const component = GlimmerResolverDelegate.lookupComponent(this.template);
            // const compiled = component.compilable.compile(Application.context);
            // // const args = Object.assign({}, this.args, item);
            // const cursor = { element: wrapper, nextSibling: null } as Cursor;
            // let componentInstance = Application._renderComponent(this.template, cursor, compiled, item);
            // // let componentInstance = Applicaton._renderWithCurriedComponentDefinition(this.template.inner.name, wrapper, null, compiled, this.template.inner.state)

            // //set the view as the native element that was generated and pass the rendering results as the component
            // let nativeEl = wrapper.nativeView;
            // (nativeEl as any).__GlimmerComponent__ = componentInstance._meta.component;
            // args.view = nativeEl;
            const templateSelector = (args.object as ListView).itemTemplateSelector as any;
            let name = null;
            if (templateSelector) {
                name = templateSelector(item, args.index, (args.object as ListView).items);
            }

            const template = this.getItemTemplateComponent(name) as any;
            // const element = this.renderItem(template, item);

            Application.addListItem({
                id: `listViewItem${this.numberViewsCreated}`,
                node: wrapper,
                template: template.args.src,
                item
            });
            // // (nativeEl as any).__GlimmerComponent__ = componentInstance._meta.component;

            this.numberViewsCreated = this.numberViewsCreated + 1;

            // Application.state.dirty();
            // Application._rerender();

            inTransaction(Application.aotRuntime.env, () => {
                const oldState = Application.state.value();
                Application.state.forceUpdate({
                    ...oldState,
                    listViewItems: [...Application.listItems]
                });
                // Application.scheduleRerender();
                Application.result.rerender();
            });
            args.view = wrapper.nativeView;
        } else {
            //Get the component instance which we classify as the rendering result, runtime and state

            // let componentInstance = (args.view as any).__GlimmerComponent__;
            // const oldState = componentInstance.state.value();
            // componentInstance.update({
            //     ...oldState,
            //     item
            // });
            const listItem = Application.listItems.find((item) => item.id === args.view.id);
            listItem.item = item;

            inTransaction(Application.aotRuntime.env, () => {
                const oldState = Application.state.value();
                Application.state.forceUpdate({
                    ...oldState,
                    listViewItems: [...Application.listItems]
                });
                // Application.scheduleRerender();
                Application.result.rerender();
            });
            // Application.scheduleRerender();
        }
    }

    _renderComponent(name: string, cursor: Cursor, compilable: number, data: {}): ElementNode {
        let state = State(data);
        const artifact = artifacts(Application.context);
        const runtime = AotRuntime(Application.document as any, artifact, Application.resolver);
        let iterator = renderAot(runtime, compilable, cursor, state);
        // const treeBuilder = NewElementBuilder.forInitialRender(runtime.env, cursor);
        // let iterator = renderAotMain(runtime, state, treeBuilder, compilable);
        try {
            const result = renderSync(Application.aotRuntime.env, iterator);
            console.log(`Component ${name} Rendered`);
            let node = result.firstNode() as any;
            while (!node._nativeView) {
                node = node.nextSibling;
            }
            node._meta.component = new NativeComponentResult(name, result, state, runtime);
            return node as any;
        } catch (error) {
            console.log(`Error rendering component ${name}: ${error}`);
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

    get nativeView(): NativeListView {
        return super.nativeView as NativeListView;
    }

    set nativeView(view: NativeListView) {
        super.nativeView = view;
    }
}

export class GlimmerKeyedTemplate implements KeyedTemplate {
    _key: any;
    constructor(key) {
        this._key = key;
    }

    get key() {
        return this._key;
    }

    createView() {
        // we are returning null because we don't have the data here
        // the view will be created in the `patchTemplate` method above.
        // see https://github.com/nativescript-vue/nativescript-vue/issues/229#issuecomment-390330474
        return null;
    }
}
