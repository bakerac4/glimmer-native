import GlimmerComponent from '@glimmer/component/dist/types/addon/-private/component';
import { ListViewEventData, RadListView } from 'nativescript-ui-listview';
import { View } from 'tns-core-modules/ui/core/view/view';
import NativeElementNode from './NativeElementNode';
export default class RadListViewElement extends NativeElementNode {
    nativeView: RadListView;
    lastItemSelected: any;
    component: any;
    templates: {};
    constructor();
    readonly itemTemplateComponent: GlimmerComponent;
    loadView(viewType: string): View;
    updateListItem(args: ListViewEventData): void;
    getItemTemplateComponent(name: any): GlimmerComponent;
    renderItem(view: any, template: any, item: any): any;
}
