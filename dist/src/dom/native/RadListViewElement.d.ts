import { ListViewEventData } from 'nativescript-ui-listview';
import { View } from 'tns-core-modules/ui/core/view/view';
import NativeElementNode from './NativeElementNode';
export default class RadListViewElement extends NativeElementNode {
    constructor();
    loadView(viewType: string): View;
    updateListItem(args: ListViewEventData): void;
}
