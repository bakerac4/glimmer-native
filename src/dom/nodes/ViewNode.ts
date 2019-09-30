import { isAndroid, isIOS } from 'tns-core-modules/platform';
import { EventData } from 'tns-core-modules/ui/page/page';
import { isBoolean } from 'tns-core-modules/utils/types';

import { getViewMeta, normalizeElementName } from '../element-registry';

const XML_ATTRIBUTES = Object.freeze(['tap', 'style', 'rows', 'columns', 'fontAttributes']);

export default class ViewNode {
    nodeValue: any;
    namespaceURI: any;
    attributes: any;
    insertAdjacentHTML: any;
    getAttributeNS: any;
    removeAttributeNS: any;
    setAttributeNS: any;
    nodeName: any;
    previousSibling: any;
    cloneNode: any;
    args: any;
    template: any;

    nodeType: any;
    _tagName: any;
    parentNode: any;
    childNodes: any;
    prevSibling: any;
    nextSibling: any;
    _ownerDocument: any;
    _nativeView: any;
    _meta: any;

    constructor() {
        this.nodeType = null;
        this._tagName = null;
        this.parentNode = null;
        this.childNodes = [];
        this.prevSibling = null;
        this.nextSibling = null;

        this._ownerDocument = null;
        this._nativeView = null;
        this._meta = null;
    }

    hasAttribute() {
        return false;
    }

    removeAttribute() {
        return false;
    }

    /* istanbul ignore next */
    toString() {
        return `${this.constructor.name}(${this.tagName})`;
    }

    set tagName(name) {
        this._tagName = normalizeElementName(name);
    }

    get tagName() {
        return this._tagName;
    }

    get firstChild() {
        return this.childNodes.length ? this.childNodes[0] : null;
    }

    get lastChild() {
        return this.childNodes.length ? this.childNodes[this.childNodes.length - 1] : null;
    }

    get nativeView() {
        return this._nativeView;
    }

    set nativeView(view) {
        if (this._nativeView) {
            throw new Error(`Can't override native view.`);
        }

        this._nativeView = view;
    }

    get meta() {
        if (this._meta) {
            return this._meta;
        }

        return (this._meta = getViewMeta(this.tagName));
    }

    /* istanbul ignore next */
    get ownerDocument() {
        if (this._ownerDocument) {
            return this._ownerDocument;
        }

        let el = this;
        while (el != null && el.nodeType !== 9) {
            el = el.parentNode;
        }

        return (this._ownerDocument = el);
    }

    getAttribute(key) {
        return this.nativeView[key];
    }

    /* istanbul ignore next */
    setAttribute(key, value) {
        const nv = this.nativeView;

        if (!nv) return;

        // normalize key
        if (isAndroid && key.startsWith('android:')) {
            key = key.substr(8);
        }
        if (isIOS && key.startsWith('ios:')) {
            key = key.substr(4);
        }

        // try to fix case
        let lowerkey = key.toLowerCase();
        for (let realKey in nv) {
            if (lowerkey == realKey.toLowerCase()) {
                key = realKey;
                break;
            }
        }
        try {
            if (XML_ATTRIBUTES.indexOf(key) !== -1) {
                nv[key] = value;
            } else {
                // detect expandable attrs for boolean values
                // See https://vuejs.org/v2/guide/components-props.html#Passing-a-Boolean
                if (isBoolean(nv[key]) && value === '') {
                    value = true;
                } else {
                    nv[key] = value;
                }
            }
        } catch (e) {
            // ignore but log
            console.warn(`set attribute threw an error, attr:${key} on ${this._tagName}: ${e.message}`);
        }
    }

    /* istanbul ignore next */
    setStyle(property, value) {
        if (!(value = value.trim()).length) {
            return;
        }

        if (property.endsWith('Align')) {
            // NativeScript uses Alignment instead of Align, this ensures that text-align works
            property += 'ment';
        }
        this.nativeView.style[property] = value;
    }

    /* istanbul ignore next */
    setText(text) {
        if (this.nodeType === 3) {
            this.parentNode.setText(text);
        } else {
            this.setAttribute('text', text);
        }
    }

    /* istanbul ignore next */
    addEventListener(event, handler) {
        this.nativeView.on(event, handler);
    }

    /* istanbul ignore next */
    removeEventListener(event, handler) {
        this.nativeView.off(event, handler);
    }

    dispatchEvent(event: EventData) {
        if (this.nativeView) {
            //nativescript uses the EventName while dom uses Type
            event.eventName = (event as any).type;
            this.nativeView.notify(event);
        }
    }

    onInsertedChild(childNode: ViewNode, index: number) {}

    onRemovedChild(childNode: ViewNode) {}

    insertBefore(childNode, referenceNode) {
        if (!childNode) {
            throw new Error(`Can't insert child.`);
        }

        // in some rare cases insertBefore is called with a null referenceNode
        // this makes sure that it get's appended as the last child
        if (!referenceNode) {
            return this.appendChild(childNode);
        }

        if (referenceNode.parentNode !== this) {
            throw new Error(`Can't insert child, because the reference node has a different parent.`);
        }

        if (childNode.parentNode && childNode.parentNode !== this) {
            throw new Error(`Can't insert child, because it already has a different parent.`);
        }

        if (childNode.parentNode === this) {
            // we don't need to throw an error here, because it is a valid case
            // for example when switching the order of elements in the tree
            // fixes #127 - see for more details
            // fixes #240
            // throw new Error(`Can't insert child, because it is already a child.`)
        }

        let index = this.childNodes.indexOf(referenceNode);

        childNode.parentNode = this;
        childNode.nextSibling = referenceNode;
        childNode.prevSibling = this.childNodes[index - 1];
        this.childNodes[index - 1].nextSibling = childNode;
        referenceNode.prevSibling = childNode;
        this.childNodes.splice(index, 0, childNode);

        this.onInsertedChild(childNode, index);
    }

    appendChild(childNode) {
        if (!childNode) {
            throw new Error(`Can't append child.`);
        }

        if (childNode.parentNode && childNode.parentNode !== this) {
            throw new Error(`Can't append child, because it already has a different parent.`);
        }

        if (childNode.parentNode === this) {
            // we don't need to throw an error here, because it is a valid case
            // for example when switching the order of elements in the tree
            // fixes #127 - see for more details
            // fixes #240
            // throw new Error(`Can't append child, because it is already a child.`)
        }

        childNode.parentNode = this;

        if (this.lastChild) {
            childNode.prevSibling = this.lastChild;
            this.lastChild.nextSibling = childNode;
        }

        this.childNodes.push(childNode);

        this.onInsertedChild(childNode, this.childNodes.length - 1);
    }

    removeChild(childNode) {
        if (!childNode) {
            throw new Error(`Can't remove child.`);
        }

        if (!childNode.parentNode) {
            throw new Error(`Can't remove child, because it has no parent.`);
        }

        if (childNode.parentNode !== this) {
            throw new Error(`Can't remove child, because it has a different parent.`);
        }

        childNode.parentNode = null;

        if (childNode.prevSibling) {
            childNode.prevSibling.nextSibling = childNode.nextSibling;
        }

        if (childNode.nextSibling) {
            childNode.nextSibling.prevSibling = childNode.prevSibling;
        }

        // reset the prevSibling and nextSibling. If not, a keep-alived component will
        // still have a filled nextSibling attribute so vue will not
        // insert the node again to the parent. See #220
        // childNode.prevSibling = null;
        // childNode.nextSibling = null;

        this.childNodes = this.childNodes.filter((node) => node !== childNode);

        this.onRemovedChild(childNode);
    }

    removeChildren() {
        this.childNodes = [];
    }

    firstElement() {
        for (var child of this.childNodes) {
            if (child.nodeType == 1) {
                return child;
            }
        }
        return null;
    }
}
