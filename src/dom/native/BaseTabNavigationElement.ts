import { TabContentItem } from 'tns-core-modules/ui/tab-navigation-base/tab-content-item';
import { TabNavigationBase } from 'tns-core-modules/ui/tab-navigation-base/tab-navigation-base';

import ViewNode from '../nodes/ViewNode';
import NativeViewElementNode from './NativeViewElementNode';

export default class BaseTabNavigationElement extends NativeViewElementNode<TabNavigationBase> {
    constructor(tagName: string, viewClass: new () => TabNavigationBase) {
        super(tagName, viewClass);
    }

    onInsertedChild(childNode: ViewNode, index: number) {
        try {
            if (childNode instanceof NativeViewElementNode && childNode.nativeView instanceof TabContentItem) {
                console.debug(`adding tab content to nav`);
                let item = childNode.nativeView;
                //wait for next turn so that any content for our tab is attached to the dom
                Promise.resolve().then(() => {
                    let items = (this.nativeView.items || []).concat([item]);
                    this.nativeView.items = [];
                    this.nativeView.items = this.nativeView.items.concat(items);
                });
                return;
            }
        } catch (e) {
            console.error(e);
        }
        super.onInsertedChild(childNode, index);
    }

    onRemovedChild(childNode: ViewNode) {
        try {
            if (childNode instanceof NativeViewElementNode && childNode.nativeView instanceof TabContentItem) {
                console.debug(`removing content item from nav`);
                let items = (this.nativeView.items || []).filter((i) => i != childNode.nativeView);
                this.nativeView.items = [];
                this.nativeView.items = items;
                return;
            }
        } catch (e) {
            console.error(e);
        }
        super.onRemovedChild(childNode);
    }
}
