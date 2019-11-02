import GlimmerComponent from '@glimmer/component/dist/types/addon/-private/component';
import { ListViewEventData, RadListView } from 'nativescript-ui-listview';
import { View } from 'tns-core-modules/ui/core/view/view';
import NativeViewElementNode from './NativeViewElementNode';
export default class RadListViewElement extends NativeViewElementNode<RadListView> {
    nativeView: RadListView;
    lastItemSelected: any;
    component: any;
    items: any[];
    templates: {};
    constructor();
    readonly itemTemplateComponent: GlimmerComponent;
    loadView(viewType: string): View;
    updateListItem(args: ListViewEventData): void;
    private updateViewWithProps;
    getItemTemplateComponent(name: any): GlimmerComponent;
    renderItem(view: any, template: any, item: any): any;
}
