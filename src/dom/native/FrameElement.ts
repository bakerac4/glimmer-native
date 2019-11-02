import { View } from 'tns-core-modules/ui/core/view';
import { Frame } from 'tns-core-modules/ui/frame';

import { createElement } from '../element-registry';
import ViewNode from '../nodes/ViewNode';
import NativeViewElementNode from './NativeViewElementNode';
import PageElement from './PageElement';

export default class FrameElement extends NativeViewElementNode<Frame> {
    constructor() {
        super('frame', Frame);
    }

    setAttribute(key: string, value: any) {
        if (key.toLowerCase() == 'defaultpage') {
            console.debug(`loading page ${value}`);
            let dummy = createElement('fragment');
            let page = new (value as any)({ target: dummy, props: {} });
            (this.nativeView as Frame).navigate({
                create: () => (dummy.firstElement() as NativeViewElementNode<View>).nativeView
            });
            return;
        }
        super.setAttribute(key, value);
    }

    //In regular native script, Frame elements aren't meant to have children, we instead allow it to have one.. a page.. as a convenience
    // and set the instance as the default page by navigating to it.
    onInsertedChild(childNode: ViewNode, index: number) {
        //only handle page nodes
        if (!(childNode instanceof PageElement)) return;

        this.nativeView.navigate({ create: () => childNode.nativeView });
    }
}
