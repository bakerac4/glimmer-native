import { Frame } from 'tns-core-modules/ui/frame';
import { createElement } from '../element-registry';
import NativeViewElementNode from './NativeViewElementNode';
import PageElement from './PageElement';
export default class FrameElement extends NativeViewElementNode {
    constructor() {
        super('frame', Frame);
    }
    setAttribute(key, value) {
        if (key.toLowerCase() == 'defaultpage') {
            console.debug(`loading page ${value}`);
            let dummy = createElement('fragment');
            let page = new value({ target: dummy, props: {} });
            this.nativeView.navigate({
                create: () => dummy.firstElement().nativeView
            });
            return;
        }
        super.setAttribute(key, value);
    }
    //In regular native script, Frame elements aren't meant to have children, we instead allow it to have one.. a page.. as a convenience
    // and set the instance as the default page by navigating to it.
    onInsertedChild(childNode, index) {
        //only handle page nodes
        if (!(childNode instanceof PageElement))
            return;
        // this.nativeView.navigate({ create: () => childNode.nativeView });
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
        childNode.prevSibling = null;
        childNode.nextSibling = null;
        this.childNodes = this.childNodes.filter((node) => node !== childNode);
        this.onRemovedChild(childNode);
    }
}
