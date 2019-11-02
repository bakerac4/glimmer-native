import { ActionBar } from 'tns-core-modules/ui/action-bar';
import ViewNode from '../nodes/ViewNode';
import NativeViewElementNode from './NativeViewElementNode';
export default class ActionBarElement extends NativeViewElementNode<ActionBar> {
    constructor();
    onInsertedChild(childNode: ViewNode, index: number): void;
    onRemovedChild(childNode: ViewNode): void;
}
