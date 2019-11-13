import { RadListView } from 'nativescript-ui-listview';
import ViewNode from '../nodes/ViewNode';
import NativeElementNode from './NativeElementNode';
export default class RadListViewElement extends NativeElementNode {
    lastItemSelected: any;
    component: any;
    constructor();
    private loadView;
    private getComponentForView;
    private updateViewWithProps;
    private updateListItem;
    nativeView: RadListView;
    onInsertedChild(childNode: ViewNode, index: number): void;
    onRemovedChild(childNode: ViewNode): void;
}
