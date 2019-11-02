import { TabView } from 'tns-core-modules/ui/tab-view';
import ViewNode from '../nodes/ViewNode';
import NativeViewElementNode from './NativeViewElementNode';
export default class TabViewElement extends NativeViewElementNode<TabView> {
    private needs_update;
    constructor();
    doUpdate(): void;
    onInsertedChild(childNode: ViewNode, index: number): any;
    onRemovedChild(childNode: ViewNode): void;
}
