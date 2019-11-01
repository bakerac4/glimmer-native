import { inTransaction } from '@glimmer/runtime/dist/modules/es2017/lib/environment';
import { ListViewViewType, RadListView } from 'nativescript-ui-listview';
import Application from '../../..';
import { Compilable } from '../../glimmer/context';
import { createElement } from '../element-registry';
import NativeElementNode from './NativeElementNode';
import TemplateElement from './TemplateElement';
export default class RadListViewElement extends NativeElementNode {
    constructor() {
        super('radlistview', RadListView, null);
        this.items = [];
        this.templates = {};
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
        if (viewType.toLowerCase() == ListViewViewType.ItemView.toLowerCase() &&
            typeof this.nativeView.itemTemplates == 'object') {
            let keyedTemplate = this.nativeView.itemTemplates.find((t) => t.key == 'default');
            if (keyedTemplate) {
                return keyedTemplate.createView();
            }
        }
        let template = this.getItemTemplateComponent(viewType);
        if (!template)
            return null;
        console.log('creating view for ', viewType);
        let wrapper = createElement('StackLayout');
        wrapper.setAttribute('class', 'list-view-item');
        let nativeEl = wrapper.nativeView;
        this.items.push(wrapper);
        Application.addListItem({ id: this.items.length, node: wrapper, template: template.args.src });
        let builder = (props) => {
            inTransaction(Application.aotRuntime.env, () => {
                const view = this.renderItem(wrapper, template, props);
                nativeEl.__GlimmerComponent__ = view;
            });
        };
        //for certain view types we like to delay until we have the data
        if (viewType.toLowerCase() == ListViewViewType.ItemView.toLowerCase() ||
            viewType.toLowerCase() == ListViewViewType.GroupView.toLowerCase()
        //    || viewType.toLowerCase() == ListViewViewType.ItemSwipeView.toLowerCase() doesn't work at the moment
        ) {
            nativeEl.__GlimmerComponentBuilder__ = builder;
        }
        else {
            //otherwise, do it now
            builder({});
        }
    }
    updateListItem(args) {
        let item;
        let listView = this.nativeView;
        let items = listView.items;
        if (args.index >= items.length) {
            this.updateViewWithProps(args.view, { item: args.view.bindingContext.category });
            return;
        }
        if (items.getItem) {
            item = items.getItem(args.index);
        }
        else {
            item = items[args.index];
        }
        this.updateViewWithProps(args.view, { item });
    }
    updateViewWithProps(view, props) {
        let componentInstance;
        let _view = view;
        if (!_view.__GlimmerComponent__) {
            if (_view.__GlimmerComponentBuilder__) {
                console.debug('mounting to view ' + view + ' with props ' + Object.keys(props).join(','));
                _view.__GlimmerComponentBuilder__(props);
                _view.__GlimmerComponentBuilder__ = null;
                return;
            }
        }
        if (_view.__GlimmerComponent__) {
            componentInstance = _view.__GlimmerComponent__;
        }
        if (componentInstance) {
            console.debug('updating view ' + view + ' with props ' + Object.keys(props).join(','));
            inTransaction(Application.aotRuntime.env, () => {
                const oldState = componentInstance.state.value();
                // Update the state with the new item
                componentInstance.update(Object.assign(Object.assign({}, oldState), { item: props }));
            });
            // const pageNode = Application.renderedPage;
            // const oldState = pageNode._meta.nativeComponentResult.state.value();
            // Application.renderedPage._meta.nativeComponentResult.update({
            //     ...oldState,
            //     item
            // });
            // Application._rerender();
        }
        else {
            console.error("Couldn't find component for ", view);
        }
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
    renderItem(view, template, item) {
        // const component = GlimmerResolverDelegate.lookupComponent(template.args.name);
        // const compiled = component.compilable.compile(Application.context);
        const cursor = { element: view, nextSibling: null };
        let componentInstance = Application._renderComponent(null, cursor, template.compiled, Object.assign(Object.assign({}, template.args), { item }));
        let nativeEl = view.nativeView;
        nativeEl.__GlimmerComponent__ = componentInstance._meta.component;
        return nativeEl;
    }
}
