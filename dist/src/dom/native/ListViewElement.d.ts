import GlimmerComponent from '@glimmer/component/dist/types/addon/-private/component';
import { ItemEventData, ListView as NativeListView } from 'tns-core-modules/ui/list-view';
import NativeElementNode from './NativeElementNode';
export default class ListViewElement extends NativeElementNode {
    template: GlimmerComponent;
    items: any;
    constructor();
    updateListItem(args: ItemEventData): void;
    readonly itemTemplateComponent: GlimmerComponent<object>;
    nativeView: NativeListView;
}
