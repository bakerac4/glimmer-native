import { ListView as NativeListView } from 'tns-core-modules/ui/list-view';
import Application from '../../..';
import { createElement } from '../element-registry';
import NativeElementNode from './NativeElementNode';
import TemplateElement from './TemplateElement';
export default class ListViewElement extends NativeElementNode {
    constructor() {
        super('listview', NativeListView, null);
        this.template = null;
        this.numberViewsCreated = 0;
        this.nativeView.on(NativeListView.itemLoadingEvent, (args) => {
            this.updateListItem(args);
        });
    }
    updateListItem(args) {
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
            let wrapper = createElement('StackLayout');
            wrapper.setAttribute('class', 'list-view-item');
            wrapper.setAttribute('id', `list-view-${numberViewsCreated}`);
            const template = this.itemTemplateComponent;
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
        }
        else {
            //Get the component instance which we classify as the rendering result, runtime and state
            let componentInstance = args.view.__GlimmerComponent__;
            const listItem = Application.listItems.find((item) => `list-view-${item.id}` === args.view.id);
            listItem.item = item;
            // const oldState = componentInstance.state.value();
            // // Update the state with the new item
            // componentInstance.update({
            //     ...oldState,
            //     item
            // });
        }
        const oldState = Application.renderedPage._meta.nativeComponentResult.state.value();
        Application.renderedPage._meta.nativeComponentResult.update(Object.assign(Object.assign({}, oldState), { listViewItems: Application.listItems }));
        Application._rerender();
    }
    get itemTemplateComponent() {
        const templateNode = this.childNodes.find((x) => x instanceof TemplateElement);
        return templateNode ? templateNode.component : null;
    }
    get nativeView() {
        return super.nativeView;
    }
    set nativeView(view) {
        super.nativeView = view;
    }
}
