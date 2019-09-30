import { ListView as NativeListView } from 'tns-core-modules/ui/list-view';
import Application from '../../..';
import GlimmerResolverDelegate from '../../glimmer/context';
import { createElement } from '../element-registry';
import NativeElementNode from './NativeElementNode';
export default class ListViewElement extends NativeElementNode {
    constructor() {
        super('listview', NativeListView, null);
        this.template = null;
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
        if (!args.view || !args.view.__GlimmerComponent__) {
            //Create the wrapper element
            let wrapper = createElement('StackLayout');
            wrapper.setAttribute('class', 'list-view-item');
            //Render the component with the passed in name into the wrapper element
            const component = GlimmerResolverDelegate.lookupComponent(this.template);
            const compiled = component.compilable.compile(Application.context);
            // const args = Object.assign({}, this.args, item);
            const cursor = { element: wrapper, nextSibling: null };
            let componentInstance = Application._renderComponent(this.template, cursor, compiled, item);
            // let componentInstance = Applicaton._renderWithCurriedComponentDefinition(this.template.inner.name, wrapper, null, compiled, this.template.inner.state)
            //set the view as the native element that was generated and pass the rendering results as the component
            let nativeEl = wrapper.nativeView;
            nativeEl.__GlimmerComponent__ = componentInstance._meta.component;
            args.view = nativeEl;
        }
        else {
            //Get the component instance which we classify as the rendering result, runtime and state
            let componentInstance = args.view.__GlimmerComponent__;
            let state = componentInstance.state;
            //Update the state with the new item
            state.update({ item });
            //and now tell glimmer to re-render
            componentInstance.runtime.env.begin();
            componentInstance.result.rerender();
            componentInstance.runtime.env.commit();
        }
    }
    get itemTemplateComponent() {
        return this.template;
    }
    get nativeView() {
        return super.nativeView;
    }
    set nativeView(view) {
        super.nativeView = view;
    }
}
