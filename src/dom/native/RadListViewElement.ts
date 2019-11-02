import GlimmerComponent from '@glimmer/component/dist/types/addon/-private/component';
import { Cursor } from '@glimmer/interfaces';
import { inTransaction } from '@glimmer/runtime/dist/modules/es2017/lib/environment';
import { ListViewEventData, ListViewViewType, RadListView } from 'nativescript-ui-listview';
import { View } from 'tns-core-modules/ui/core/view/view';

import Application from '../../..';
import GlimmerResolverDelegate, { Compilable } from '../../glimmer/context';
import NativeComponentResult from '../../glimmer/result';
import { createElement } from '../element-registry';
import NativeViewElementNode from './NativeViewElementNode';
import TemplateElement from './TemplateElement';

export default class RadListViewElement extends NativeViewElementNode<RadListView> {
    nativeView: RadListView;
    lastItemSelected: any;
    component: any;
    items = [];
    templates = {};
    constructor() {
        super('radlistview', RadListView, null);

        let nativeView = this.nativeView as RadListView;

        nativeView.itemViewLoader = (viewType: any): View => this.loadView(viewType);
        this.nativeView.on(RadListView.itemLoadingEvent, (args) => {
            this.updateListItem(args as ListViewEventData);
        });
    }

    get itemTemplateComponent(): GlimmerComponent {
        const templateNode = this.childNodes.find((x) => x instanceof TemplateElement) as TemplateElement;
        return templateNode ? templateNode.component : null;
    }

    loadView(viewType: string): View {
        if (
            viewType.toLowerCase() == ListViewViewType.ItemView.toLowerCase() &&
            typeof this.nativeView.itemTemplates == 'object'
        ) {
            let keyedTemplate = this.nativeView.itemTemplates.find((t) => t.key == 'default');
            if (keyedTemplate) {
                return keyedTemplate.createView();
            }
        }

        let template = this.getItemTemplateComponent(viewType);
        if (!template) return null;
        console.log('creating view for ', viewType);

        let wrapper = createElement('StackLayout') as NativeViewElementNode<View>;
        wrapper.setAttribute('class', 'list-view-item');
        let nativeEl = wrapper.nativeView;
        this.items.push(wrapper);
        Application.addListItem({ id: this.items.length, node: wrapper, template: (template.args as any).src });

        let builder = (props: any) => {
            inTransaction(Application.aotRuntime.env, () => {
                const view = this.renderItem(wrapper, template, props);
                (nativeEl as any).__GlimmerComponent__ = view;
            });
        };
        //for certain view types we like to delay until we have the data
        if (
            viewType.toLowerCase() == ListViewViewType.ItemView.toLowerCase() ||
            viewType.toLowerCase() == ListViewViewType.GroupView.toLowerCase()
            //    || viewType.toLowerCase() == ListViewViewType.ItemSwipeView.toLowerCase() doesn't work at the moment
        ) {
            (nativeEl as any).__GlimmerComponentBuilder__ = builder;
        } else {
            //otherwise, do it now
            builder({});
        }
    }

    updateListItem(args: ListViewEventData) {
        let item;
        let listView = this.nativeView;
        let items = listView.items;

        if (args.index >= items.length) {
            this.updateViewWithProps(args.view, { item: args.view.bindingContext.category });
            return;
        }

        if (items.getItem) {
            item = items.getItem(args.index);
        } else {
            item = items[args.index];
        }

        this.updateViewWithProps(args.view, { item });
    }

    private updateViewWithProps(view: View, props: any) {
        let componentInstance: NativeComponentResult;
        let _view = view as any;
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
                componentInstance.update({
                    ...oldState,
                    item: props
                });
            });
            // const pageNode = Application.renderedPage;
            // const oldState = pageNode._meta.nativeComponentResult.state.value();
            // Application.renderedPage._meta.nativeComponentResult.update({
            //     ...oldState,
            //     item
            // });
            // Application._rerender();
        } else {
            console.error("Couldn't find component for ", view);
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

    renderItem(view, template, item) {
        // const component = GlimmerResolverDelegate.lookupComponent(template.args.name);
        // const compiled = component.compilable.compile(Application.context);
        const cursor = { element: view, nextSibling: null } as Cursor;
        let componentInstance = Application._renderComponent(null, cursor, template.compiled, {
            ...template.args,
            item
        });

        let nativeEl = view.nativeView;
        (nativeEl as any).__GlimmerComponent__ = componentInstance;
        return nativeEl;
    }
}
