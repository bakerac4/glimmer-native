// import GlimmerComponent from '@glimmer/component/dist/types/addon/-private/component';
import GlimmerComponent from '@glimmer/component/dist/types/addon/-private/component';
import { ItemEventData, ItemsSource, ListView as NativeListView } from 'tns-core-modules/ui/list-view';

import Application from '../../..';
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

    updateListItem(args: ItemEventData) {
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
            wrapper.setAttribute('id', `list-view-${numberViewsCreated}`);
            const template = this.itemTemplateComponent as any;
            // const component = GlimmerResolverDelegate.lookupComponent(template.args.name);
            // const compiled = component.compilable.compile(Application.context);
            // const cursor = { element: wrapper, nextSibling: null } as Cursor;
            // let component = Compilable(template.args.src);
            // const compiled = component.compile(Application.context);
            // let componentInstance = Application._renderComponent(null, cursor, compiled, { ...template.args, item });

            let nativeEl = wrapper.nativeView;
            Application.addListItem({ id: numberViewsCreated, node: wrapper, template: template.args.src, item });
            // (nativeEl as any).__GlimmerComponent__ = componentInstance._meta.component;
            args.view = nativeEl;
            this.numberViewsCreated = this.numberViewsCreated + 1;
            const oldState = Application.state.value();
            Application.state.forceUpdate({
                ...oldState,
                listViewItems: Application.listItems
            });
            Application.scheduleRerender();
        } else {
            //Get the component instance which we classify as the rendering result, runtime and state
            let componentInstance = (args.view as any).__GlimmerComponent__;
            const listItem = Application.listItems.find((item) => `list-view-${item.id}` === args.view.id);
            listItem.item = item;
            // const oldState = componentInstance.state.value();
            // // Update the state with the new item
            // componentInstance.update({
            //     ...oldState,
            //     item
            // });
            const oldState = Application.state.value();
            Application.state.forceUpdate({
                ...oldState,
                listViewItems: Application.listItems
            });
            // Application._rerender();
            Application.scheduleRerender();
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
