import { Frame } from 'tns-core-modules/ui/frame';
import { createElement } from '../element-registry';
import NativeElementNode from './NativeElementNode';
export default class FrameElement extends NativeElementNode {
    constructor() {
        super('frame', Frame, null);
    }
    setAttribute(key, value) {
        if (key.toLowerCase() == 'defaultpage') {
            let dummy = createElement('fragment');
            let page = new value({ target: dummy, props: {} });
            this.nativeView.navigate({
                create: () => dummy.firstElement().nativeView
            });
        }
    }
    get nativeView() {
        return super.nativeView;
    }
    set nativeView(view) {
        super.nativeView = view;
    }
    //In regular native script, Frame elements aren't meant to have children, we instead allow it to have one.. a page.. as a convenience
    // and set the instance as the default page by navigating to it.
    appendChild(childNode) {
        //only handle page nodes
        // if (!(childNode instanceof PageElement)) return;
        // this.nativeView.navigate({ create: () => childNode.nativeView });
        return;
    }
}
