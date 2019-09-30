import { ItemEventData, ListView as NativeListView } from 'tns-core-modules/ui/list-view';
import NativeElementNode from './NativeElementNode';
export default class ListViewElement extends NativeElementNode {
    template: any;
    items: any;
    constructor();
    updateListItem(args: ItemEventData): void;
    readonly itemTemplateComponent: any;
    nativeView: NativeListView;
}
