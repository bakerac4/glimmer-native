// import GlimmerComponent from '@glimmer/component/dist/types/addon/-private/component';
import GlimmerComponent from '@glimmer/component/dist/types/addon/-private/component';
import { Cursor } from '@glimmer/interfaces';
import { artifacts } from '@glimmer/program';
import { State } from '@glimmer/reference';
import { AotRuntime, renderAot, renderSync } from '@glimmer/runtime';
import { ItemEventData, ItemsSource, ListView as NativeListView } from 'tns-core-modules/ui/list-view';

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

    constructor() {
        super('listview', NativeListView, null);
        this.nativeView.on(NativeListView.itemLoadingEvent, (args) => {
            this.updateListItem(args as ItemEventData);
        });
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
            // let wrapper = createElement('StackLayout') as NativeElementNode;
            // wrapper.setAttribute('class', 'list-view-item');

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
            let numberViewsCreated = this.numberViewsCreated;
            let wrapper = createElement('StackLayout') as NativeElementNode;
            wrapper.setAttribute('class', 'list-view-item');
            wrapper.setAttribute('id', `listViewItem${numberViewsCreated}`);
            const template = this.itemTemplateComponent as any;
            // const component = GlimmerResolverDelegate.lookupComponent(template.args.name);
            // const compiled = component.compilable.compile(Application.context);
            const cursor = { element: wrapper, nextSibling: null } as Cursor;
            let component = Compilable(template.args.src);
            const compiled = component.compile(Application.context);
            let componentInstance = this._renderComponent(null, cursor, compiled, { ...template.args, item });

            let nativeEl = wrapper.nativeView;
            (nativeEl as any).__GlimmerComponent__ = componentInstance._meta.component;
            // Application.addListItem({
            //     id: `listViewItem${numberViewsCreated}`,
            //     node: wrapper,
            //     template: template.args.src,
            //     item
            // });
            // // (nativeEl as any).__GlimmerComponent__ = componentInstance._meta.component;

            // this.numberViewsCreated = this.numberViewsCreated + 1;

            // const oldState = Application.state.value();
            // Application.state.forceUpdate({
            //     ...oldState,
            //     ...Application.listItems
            // });

            args.view = nativeEl;
            // await Application.scheduleRerender();
            // args.view.layout();
        } else {
            //Get the component instance which we classify as the rendering result, runtime and state

            let componentInstance = (args.view as any).__GlimmerComponent__;
            const oldState = componentInstance.state.value();
            componentInstance.update({
                ...oldState,
                item
            });
            // const listItem = Application.listItems[args.view.id];
            // listItem.item = item;
            // const oldState = componentInstance.state.value();
            // // Update the state with the new item
            // componentInstance.update({
            //     ...oldState,
            //     item
            // });
            // const oldState = Application.state.value();
            Application.state.dirty();
            // Application._rerender();
            Application._rerender();
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

    get itemTemplateComponent(): GlimmerComponent {
        const templateNode = this.childNodes.find((x) => x instanceof TemplateElement) as TemplateElement;
        return templateNode ? templateNode.component : null;
    }

    get nativeView(): NativeListView {
        return super.nativeView as NativeListView;
    }

    set nativeView(view: NativeListView) {
        super.nativeView = view;
    }
}
