import { TabNavigationBase } from 'tns-core-modules/ui/tab-navigation-base/tab-navigation-base';
import ViewNode from '../nodes/ViewNode';
import NativeViewElementNode from './NativeViewElementNode';
export default class BaseTabNavigationElement extends NativeViewElementNode<TabNavigationBase> {
    constructor(tagName: string, viewClass: new () => TabNavigationBase);
    onInsertedChild(childNode: ViewNode, index: number): void;
    onRemovedChild(childNode: ViewNode): void;
}
