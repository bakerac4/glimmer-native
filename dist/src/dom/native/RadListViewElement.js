import { ListViewViewType, RadListView } from 'nativescript-ui-listview';
import Application from '../../../';
import { Compilable } from '../../glimmer/context';
import { createElement } from '../element-registry';
import NativeElementNode from './NativeElementNode';
import TemplateElement from './TemplateElement';
export default class RadListViewElement extends NativeElementNode {
    constructor() {
        super('radlistview', RadListView, null);
        let nativeView = this.nativeView;
        nativeView.itemViewLoader = (viewType) => this.loadView(viewType);
        this.nativeView.on(RadListView.itemLoadingEvent, (args) => {
            this.updateListItem(args);
        });
    }
    get itemTemplateComponent() {
        const templateNode = this.childNodes.find((x) => x instanceof TemplateElement);
        return templateNode ? templateNode.component : null;
    }
    loadView(viewType) {
        if (viewType === ListViewViewType.ItemView) {
            console.log('creating view for ', viewType);
            const template = this.itemTemplateComponent;
            let wrapper = createElement('StackLayout');
            wrapper.setAttribute('class', 'list-view-item');
            let modifiedTemplate = `
                {{#in-element this.wrapper insertBefore=null}} ${template.args.src} {{/in-element}}
            `;
            let component = Compilable(modifiedTemplate);
            const cursor = { element: wrapper, nextSibling: null };
            const compiled = component.compile(Application.context);
            let componentNode = Application._renderComponent(null, cursor, compiled, Object.assign({ wrapper: Application.renderedPage.childNodes[1] }, template.args));
            let nativeEl = componentNode.nativeView;
            nativeEl.parent = null;
            nativeEl.parentNode = null;
            Application.addListItem(componentNode);
            nativeEl.__GlimmerComponent__ = componentNode._meta.component;
            return nativeEl;
        }
    }
    updateListItem(args) {
        let item;
        let listView = this.nativeView;
        let items = listView.items;
        if (args.index >= items.length) {
            console.log("Got request for item at index that didn't exists", items, args.index);
            return;
        }
        if (items.getItem) {
            item = items.getItem(args.index);
        }
        else {
            item = items[args.index];
        }
        if (args.view && args.view.__GlimmerComponent__) {
            let componentInstance = args.view.__GlimmerComponent__;
            const oldState = componentInstance.state.value();
            // Update the state with the new item
            componentInstance.update(Object.assign(Object.assign({}, oldState), { item }));
            // const pageNode = Application.renderedPage;
            // const oldState = pageNode._meta.nativeComponentResult.state.value();
            // Application.renderedPage._meta.nativeComponentResult.update({
            //     ...oldState,
            //     item
            // });
            // Application._rerender();
        }
        else {
            console.log('got invalid update call with', args.index, args.view);
        }
    }
}
