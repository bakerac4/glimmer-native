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
    removeChild(childNode) {
        if (!childNode) {
            return;
        }
        if (!childNode.parentNode) {
            return;
        }
        if (childNode.parentNode !== this) {
            return;
        }
        childNode.parentNode = null;
        // if (childNode.prevSibling) {
        //     childNode.prevSibling.nextSibling = childNode.nextSibling;
        // }
        // if (childNode.nextSibling) {
        //     childNode.nextSibling.prevSibling = childNode.prevSibling;
        // }
        // reset the prevSibling and nextSibling. If not, a keep-alived component will
        // still have a filled nextSibling attribute so vue will not
        // insert the node again to the parent. See #220
        childNode.prevSibling = null;
        childNode.nextSibling = null;
        this.childNodes = this.childNodes.filter((node) => node !== childNode);
        childNode.removeChildren();
        this.onRemovedChild(childNode);
    }
}
