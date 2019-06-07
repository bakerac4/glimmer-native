import { ContentView } from 'tns-core-modules/ui/content-view';
import { View } from 'tns-core-modules/ui/core/view';
import { LayoutBase } from 'tns-core-modules/ui/layouts/layout-base';

import ViewNode from './nodes/ViewNode';

export function isView(view) {
    return view instanceof View;
}

export function isLayout(view) {
    return view instanceof LayoutBase;
}

export function isContentView(view) {
    return view instanceof ContentView;
}

export function insertChild(parentNode: ViewNode, childNode: ViewNode, atIndex = -1) {
    if (!parentNode) {
        return;
    }

    if (parentNode.meta && typeof parentNode.meta.insertChild === 'function') {
        return parentNode.meta.insertChild(parentNode, childNode, atIndex);
    }

    if (!parentNode.nativeView || !childNode.nativeView) {
        return;
    }

    const parentView = parentNode.nativeView;
    const childView = childNode.nativeView;

    //use the builder logic if we aren't being dynamic, to catch config items like <actionbar> that are not likely to be toggled
    if (atIndex < 0 && (parentView as any)._addChildFromBuilder) {
        (parentView as any)._addChildFromBuilder(childNode._nativeView.constructor.name, childView);
        return;
    }

    if (parentView instanceof LayoutBase) {
        if (atIndex >= 0) {
            //our dom includes "textNode" and "commentNode" which does not appear in the nativeview's children.
            //we recalculate the index required for the insert operation buy only including native element nodes in the count
            // let nativeIndex = parentNode.childNodes
            //     .filter((e) => {
            //         const instance = e instanceOf ElementNode';
            //         return instance;
            //     })
            //     .indexOf(childNode);
            parentView.insertChild(childView, atIndex);
        } else {
            parentView.addChild(childView);
        }
        return;
    }

    if (parentView && (parentView as any)._addChildFromBuilder) {
        return (parentView as any)._addChildFromBuilder(childNode._nativeView.constructor.name, childView);
    }

    if (parentView instanceof ContentView) {
        parentView.content = childView;
        return;
    }

    throw new Error("Parent can't contain children: " + parentNode + ', ' + childNode);
}

export function removeChild(parentNode, childNode) {
    if (!parentNode) {
        return;
    }

    if (parentNode.meta && typeof parentNode.meta.removeChild === 'function') {
        return parentNode.meta.removeChild(parentNode, childNode);
    }

    if (!childNode.nativeView || !childNode.nativeView) {
        return;
    }

    const parentView = parentNode.nativeView;
    const childView = childNode.nativeView;

    if (parentView instanceof LayoutBase) {
        parentView.removeChild(childView);
    } else if (parentView instanceof ContentView) {
        if (parentView.content === childView) {
            parentView.content = null;
        }
        if (childNode.nodeType === 8) {
            parentView._removeView(childView);
        }
    } else if (isView(parentView)) {
        parentView._removeView(childView);
    } else {
        // throw new Error("Unknown parent type: " + parent);
    }
}
