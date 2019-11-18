import { inTransaction } from '@glimmer/runtime/dist/modules/es2017/lib/environment';
import { ListViewViewType, RadListView } from 'nativescript-ui-listview';
import { isAndroid, isIOS } from 'tns-core-modules/ui/core/view/view';
import Application from '../../..';
import { Compilable } from '../../glimmer/context';
import { createElement } from '../element-registry';
import { GlimmerKeyedTemplate } from './ListViewElement';
import NativeViewElementNode from './NativeViewElementNode';
import TemplateElement from './TemplateElement';
function renderItem(wrapper, template, item) {
    // const component = GlimmerResolverDelegate.lookupComponent(template.args.name);
    // const compiled = component.compilable.compile(Application.context);
    const cursor = { element: wrapper, nextSibling: null };
    let componentInstance = Application._renderComponent(null, cursor, template.compiled, Object.assign(Object.assign({}, template.args), { item }));
    let nativeEl = wrapper.nativeView;
    nativeEl.__GlimmerComponent__ = componentInstance.component;
    return nativeEl;
}
export default class RadListViewElement extends NativeViewElementNode {
    constructor() {
        super('radlistview', RadListView, null);
        this.items = [];
        this.templates = {};
        let nativeView = this.nativeView;
        nativeView.itemViewLoader = (viewType) => this.loadView(viewType);
        this.nativeView.on(RadListView.itemLoadingEvent, (args) => {
            this.updateListItem(args);
        });
        if (isIOS) {
            this.nativeView.on('itemLoadingInternal', (args) => {
                this.updateInternalItem(args);
            });
        }
    }
    loadView(viewType) {
        if (viewType.toLowerCase() == ListViewViewType.ItemView.toLowerCase() &&
            typeof this.nativeView.itemTemplates == 'object') {
            let keyedTemplate = this.nativeView.itemTemplates.find((t) => t.key == 'default');
            if (keyedTemplate) {
                return keyedTemplate.createView();
            }
        }
        let componentClass = this.getComponentForView(viewType);
        if (!componentClass)
            return null;
        console.log('creating view for ' + viewType);
        let wrapper = createElement('StackLayout');
        wrapper.setStyle('padding', 0);
        wrapper.setStyle('margin', 0);
        let nativeEl = wrapper.nativeView;
        let builder = (props) => {
            inTransaction(Application.aotRuntime.env, () => {
                renderItem(wrapper, { compiled: componentClass.component, args: componentClass.args }, props);
            });
            // (nativeEl as any).__GlimmerComponent__ = componentInstance;
        };
        //for certain view types we like to delay until we have the data
        if (viewType.toLowerCase() == ListViewViewType.ItemView.toLowerCase() ||
            viewType.toLowerCase() == ListViewViewType.GroupView.toLowerCase()
        //    || viewType.toLowerCase() == ListViewViewType.ItemSwipeView.toLowerCase() doesn't work at the moment
        ) {
            nativeEl.__GlimmerComponentBuilder__ = builder;
            builder({});
        }
        else {
            //otherwise, do it now
            builder({});
        }
        return nativeEl;
    }
    getComponentForView(viewType) {
        const normalizedViewType = viewType.toLowerCase();
        let templateEl = this.childNodes.find((n) => n.tagName == 'template' && String(n.getAttribute('type')).toLowerCase() == normalizedViewType);
        if (!templateEl)
            return null;
        let component = Compilable(templateEl.component.args.src);
        const compiled = component.compile(Application.context);
        return {
            component: compiled,
            args: templateEl.component.args
        };
    }
    // loadView(viewType: string): View {
    //     if (viewType === ListViewViewType.ItemView) {
    //         console.log('creating view for ', viewType);
    //         let wrapper = createElement('StackLayout') as NativeElementNode;
    //         wrapper.setAttribute('class', 'list-view-item');
    //         const template = this.itemTemplateComponent as any;
    //         // const component = GlimmerResolverDelegate.lookupComponent(template.args.name);
    //         // const compiled = component.compilable.compile(Application.context);
    //         const cursor = { element: wrapper, nextSibling: null } as Cursor;
    //         let component = Compilable(template.args.src);
    //         const compiled = component.compile(Application.context);
    //         let componentInstance = Application._renderComponent(null, cursor, compiled, template.args);
    //         let nativeEl = wrapper.nativeView;
    //         (nativeEl as any).__GlimmerComponent__ = componentInstance._meta.component;
    //         return nativeEl;
    //     }
    // }
    // get itemTemplateComponent(): GlimmerComponent {
    //     const templateNode = this.childNodes.find((x) => x instanceof TemplateElement) as TemplateElement;
    //     return templateNode ? templateNode.component : null;
    // }
    // updateListItem(args: ListViewEventData) {
    //     let item;
    //     let listView = this.nativeView as RadListView;
    //     let items = listView.items;
    //     if (args.index >= items.length) {
    //         console.log("Got request for item at index that didn't exists", items, args.index);
    //         return;
    //     }
    //     if (items.getItem) {
    //         item = items.getItem(args.index);
    //     } else {
    //         item = items[args.index];
    //     }
    //     if (args.view && (args.view as any).__GlimmerComponent__) {
    //         let componentInstance = (args.view as any).__GlimmerComponent__;
    //         const oldState = componentInstance.state.value();
    //         // Update the state with the new item
    //         componentInstance.update({
    //             ...oldState,
    //             item
    //         });
    //     } else {
    //         console.log('got invalid update call with', args.index, args.view);
    //     }
    // }
    updateViewWithProps(view, props) {
        let componentInstance;
        let _view = view;
        if (!_view.__GlimmerComponent__) {
            if (_view.__GlimmerComponentBuilder__) {
                console.log('mounting to view ' + view + ' with props ' + Object.keys(props).join(','));
                _view.__GlimmerComponentBuilder__(props);
                _view.__GlimmerComponentBuilder__ = null;
                return;
            }
        }
        if (_view.__GlimmerComponent__) {
            componentInstance = _view.__GlimmerComponent__;
        }
        if (componentInstance) {
            console.log('updating view ' + view + ' with props ' + Object.keys(props).join(','));
            inTransaction(Application.aotRuntime.env, () => {
                let componentInstance = view.__GlimmerComponent__;
                const oldState = componentInstance.state.value();
                // Update the state with the new item
                componentInstance.update(Object.assign(Object.assign({}, oldState), { item: props }));
            });
        }
        else {
            console.error("Couldn't find component for ", view);
        }
    }
    updateInternalItem(args) {
        //groups have index less than zero
        if (args.index < 0) {
            this.updateViewWithProps(args.view, args.view.bindingContext.category);
            return;
        }
    }
    updateListItem(args) {
        let item;
        let listView = this.nativeView;
        let items = listView.items;
        if (args.index >= items.length) {
            console.log("Got request for item at index that didn't exist");
            return;
        }
        if (isAndroid && args.index < 0) {
            this.updateViewWithProps(args.view, args.view.bindingContext.category);
            return;
        }
        if (items.getItem) {
            item = items.getItem(args.index);
        }
        else {
            item = items[args.index];
        }
        this.updateViewWithProps(args.view, item);
    }
    get nativeView() {
        return super.nativeView;
    }
    set nativeView(view) {
        super.nativeView = view;
    }
    onInsertedChild(childNode, index) {
        super.onInsertedChild(childNode, index);
        if (childNode instanceof TemplateElement && !childNode.getAttribute('type')) {
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
