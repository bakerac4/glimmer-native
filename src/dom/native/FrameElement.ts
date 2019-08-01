import { Frame } from 'tns-core-modules/ui/frame';

import { createElement } from '../element-registry';
import ViewNode from '../nodes/ViewNode';
import NativeElementNode from './NativeElementNode';

export default class FrameElement extends NativeElementNode {
    constructor() {
        super('frame', Frame, null);
    }

    setAttribute(key: string, value: any) {
        if (key.toLowerCase() == 'defaultpage') {
            let dummy = createElement('fragment');
            let page = new (value as any)({ target: dummy, props: {} });
            (this.nativeView as Frame).navigate({
                create: () => (dummy.firstElement() as NativeElementNode).nativeView
            });
        }
    }

    get nativeView(): Frame {
        return super.nativeView as Frame;
    }

    set nativeView(view: Frame) {
        super.nativeView = view;
    }

    //In regular native script, Frame elements aren't meant to have children, we instead allow it to have one.. a page.. as a convenience
    // and set the instance as the default page by navigating to it.
    appendChild(childNode: ViewNode) {
        //only handle page nodes
        // if (!(childNode instanceof PageElement)) return;

        // this.nativeView.navigate({ create: () => childNode.nativeView });
        return;
    }
}
