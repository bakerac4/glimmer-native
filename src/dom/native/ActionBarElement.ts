import { ActionBar } from 'tns-core-modules/ui/action-bar';

import ViewNode from '../nodes/ViewNode';
import NativeElementNode from './NativeElementNode';
import NativeViewElementNode from './NativeViewElementNode';

export default class ActionBarElement extends NativeViewElementNode<ActionBar> {
    constructor() {
        super('ActionBar', ActionBar);
    }

    onInsertedChild(childNode: ViewNode, index: number) {
        //ActionItems isn't an array or ObservableArray, it is a special ActionItems type, so we handle it here
        if (childNode instanceof NativeElementNode) {
            let propName = childNode.propAttribute;
            if (propName) {
                propName = this._normalizedKeys.get(propName) || propName;
                if (propName.toLowerCase() == 'actionitems') {
                    this.nativeView.actionItems.addItem(childNode.nativeElement);
                    return; //skip rest of the processing.
                }
            }
        }

        super.onInsertedChild(childNode, index);
    }

    onRemovedChild(childNode: ViewNode) {
        if (childNode instanceof NativeElementNode) {
            let propName = childNode.propAttribute;
            if (propName) {
                propName = this._normalizedKeys.get(propName) || propName;
                if (propName.toLowerCase() == 'actionitems') {
                    this.nativeView.actionItems.removeItem(childNode.nativeElement);
                    return; //skip rest of the processing.
                }
            }
        }

        super.onRemovedChild(childNode);
    }
}
