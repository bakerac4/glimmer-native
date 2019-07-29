import { ItemEventData, ListView as NativeListView } from 'tns-core-modules/ui/list-view';
import NativeElementNode from './NativeElementNode';
export default class ListViewElement extends NativeElementNode {
    template: any;
    yieldItem: (item: any) => {};
    constructor();
    updateListItem(args: ItemEventData): void;
    readonly itemTemplateComponent: typeof import("@glimmer/component/dist/types/addon/-private/component").default;
    nativeView: NativeListView;
}
