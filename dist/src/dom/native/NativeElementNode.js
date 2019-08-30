import { KeyframeAnimation } from 'tns-core-modules/ui/animation/keyframe-animation';
import { LayoutBase } from 'tns-core-modules/ui/layouts/layout-base';
import { ContentView, isAndroid, isIOS, View } from 'tns-core-modules/ui/page';
import { CssAnimationParser } from 'tns-core-modules/ui/styling/css-animation-parser';
import ElementNode from '../nodes/ElementNode';
function camelize(kebab) {
    return kebab.replace(/[\-]+(\w)/g, (m, l) => l.toUpperCase());
}
const defaultViewMeta = {
    skipAddToDom: false
};
export default class NativeElementNode extends ElementNode {
    constructor(tagName, viewClass, meta = null) {
        super(tagName);
        this.nodeType = 1;
        this.tagName = tagName;
        this._meta = Object.assign({}, defaultViewMeta, meta || {});
        this._nativeView = new viewClass();
        this._nativeView.__GlimmerNativeElement__ = this;
        // log.debug(`created ${this} ${this._nativeView}`);
        //TODO these style shims mess up the code, extract to external modules
        let setStyleAttribute = (value) => {
            this.setAttribute('style', value);
        };
        let getStyleAttribute = () => {
            return this.getAttribute('style');
        };
        let getParentPage = () => {
            if (this.nativeView && this.nativeView.page) {
                return this.nativeView.page.__GlimmerNativeElement__;
            }
            return null;
        };
        let animations = new Map();
        let oldAnimations = [];
        const addAnimation = (animation) => {
            // log.debug(`Adding animation ${animation}`);
            if (!this.nativeView) {
                throw Error('Attempt to apply animation to tag without a native view' + this.tagName);
            }
            let page = getParentPage();
            if (page == null) {
                animations.set(animation, null);
                return;
            }
            //quickly cancel any old ones
            while (oldAnimations.length) {
                let oldAnimation = oldAnimations.shift();
                if (oldAnimation.isPlaying) {
                    oldAnimation.cancel();
                }
            }
            //Parse our "animation" style property into an animation info instance (this won't include the keyframes from the css)
            let animationInfos = CssAnimationParser.keyframeAnimationsFromCSSDeclarations([
                { property: 'animation', value: animation }
            ]);
            if (!animationInfos) {
                animations.set(animation, null);
                return;
            }
            let animationInfo = animationInfos[0];
            //Fetch an animationInfo instance that includes the keyframes from the css (this won't include the animation properties parsed above)
            let animationWithKeyframes = page.nativeView.getKeyframeAnimationWithName(animationInfo.name);
            if (!animationWithKeyframes) {
                animations.set(animation, null);
                return;
            }
            animationInfo.keyframes = animationWithKeyframes.keyframes;
            //combine the keyframes from the css with the animation from the parsed attribute to get a complete animationInfo object
            let animationInstance = KeyframeAnimation.keyframeAnimationFromInfo(animationInfo);
            // save and launch the animation
            animations.set(animation, animationInstance);
            animationInstance.play(this.nativeView);
        };
        const removeAnimation = (animation) => {
            // log.debug(`Removing animation ${animation}`);
            if (animations.has(animation)) {
                let animationInstance = animations.get(animation);
                animations.delete(animation);
                if (animationInstance) {
                    if (animationInstance.isPlaying) {
                        //we don't want to stop right away since svelte removes the animation before it is finished due to our lag time starting the animation.
                        oldAnimations.push(animationInstance);
                    }
                }
            }
        };
        this.style = {
            setProperty: (propertyName, value, priority) => {
                this.setStyle(camelize(propertyName), value);
            },
            removeProperty: (propertyName) => {
                this.setStyle(camelize(propertyName), null);
            },
            get animation() {
                return [...animations.keys()].join(', ');
            },
            set animation(value) {
                // log.debug(`setting animation ${value}`);
                let new_animations = value.trim() == '' ? [] : value.split(',').map((a) => a.trim());
                //add new ones
                for (let anim of new_animations) {
                    if (!animations.has(anim)) {
                        addAnimation(anim);
                    }
                }
                //remove old ones
                for (let anim of animations.keys()) {
                    if (new_animations.indexOf(anim) < 0) {
                        removeAnimation(anim);
                    }
                }
            },
            get cssText() {
                // log.debug('got css text');
                return getStyleAttribute();
            },
            set cssText(value) {
                // log.debug('set css text');
                setStyleAttribute(value);
            }
        };
    }
    /* istanbul ignore next */
    setStyle(property, value) {
        // log.debug(`setStyle ${this} ${property} ${value}`);
        if (!(value = value.toString().trim()).length) {
            return;
        }
        if (property.endsWith('Align')) {
            // NativeScript uses Alignment instead of Align, this ensures that text-align works
            property += 'ment';
        }
        this.nativeView.style[property] = value;
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
        return this._meta;
    }
    /* istanbul ignore next */
    addEventListener(event, handler) {
        // log.debug(`add event listener ${this} ${event}`);
        this.nativeView.on(event, handler);
    }
    /* istanbul ignore next */
    removeEventListener(event, handler) {
        // log.debug(`remove event listener ${this} ${event}`);
        this.nativeView.off(event, handler);
    }
    getAttribute(fullkey) {
        let getTarget = this.nativeView;
        let keypath = fullkey.split('.');
        let resolvedKeys = [];
        while (keypath.length > 0) {
            if (!getTarget)
                return null;
            let key = keypath.shift();
            // try to fix case
            let lowerkey = key.toLowerCase();
            for (let realKey in getTarget) {
                if (lowerkey == realKey.toLowerCase()) {
                    key = realKey;
                    break;
                }
            }
            resolvedKeys.push(key);
            if (keypath.length > 0) {
                getTarget = getTarget[key];
            }
            else {
                return getTarget[key];
            }
        }
        return null;
    }
    onInsertedChild(childNode, index) {
        insertChild(this, childNode, index);
    }
    onRemovedChild(childNode) {
        removeChild(this, childNode);
    }
    /* istanbul ignore next */
    setAttribute(fullkey, value) {
        const nv = this.nativeView;
        let setTarget = nv;
        // normalize key
        if (isAndroid && fullkey.startsWith('android:')) {
            fullkey = fullkey.substr(8);
        }
        if (isIOS && fullkey.startsWith('ios:')) {
            fullkey = fullkey.substr(4);
        }
        //we might be getting an element from a propertyNode eg page.actionBar, unwrap
        if (value instanceof NativeElementNode) {
            value = value.nativeView;
        }
        let keypath = fullkey.split('.');
        let resolvedKeys = [];
        while (keypath.length > 0) {
            if (!setTarget)
                return;
            let key = keypath.shift();
            // try to fix case
            let lowerkey = key.toLowerCase();
            for (let realKey in setTarget) {
                if (lowerkey == realKey.toLowerCase()) {
                    key = realKey;
                    break;
                }
            }
            resolvedKeys.push(key);
            if (keypath.length > 0) {
                setTarget = setTarget[key];
            }
            else {
                try {
                    // log.debug(`setAttr ${this} ${resolvedKeys.join('.')} ${value}`);
                    setTarget[key] = value;
                }
                catch (e) {
                    // ignore but log
                    // log.error(`set attribute threw an error, attr:${key} on ${this._tagName}: ${e.message}`);
                }
            }
        }
    }
    dispatchEvent(event) {
        if (this.nativeView) {
            //nativescript uses the EventName while dom uses Type
            event.eventName = event.type;
            this.nativeView.notify(event);
        }
    }
    removeChildren() {
        this.childNodes.forEach((child) => {
            this.removeChild(child);
        });
    }
}
//TODO merge these into the class above
function insertChild(parentNode, childNode, atIndex = -1) {
    if (!parentNode) {
        return;
    }
    if (!(parentNode instanceof NativeElementNode) || !(childNode instanceof NativeElementNode)) {
        return;
    }
    if (parentNode.meta && typeof parentNode.meta.insertChild === 'function') {
        return parentNode.meta.insertChild(parentNode, childNode, atIndex);
    }
    const parentView = parentNode.nativeView;
    const childView = childNode.nativeView;
    //use the builder logic if we aren't being dynamic, to catch config items like <actionbar> that are not likely to be toggled
    if (atIndex < 0 && parentView._addChildFromBuilder) {
        parentView._addChildFromBuilder(childNode._nativeView.constructor.name, childView);
        return;
    }
    if (parentView instanceof LayoutBase) {
        if (atIndex >= 0) {
            //our dom includes "textNode" and "commentNode" which does not appear in the nativeview's children.
            //we recalculate the index required for the insert operation buy only including native element nodes in the count
            let nativeIndex = parentNode.childNodes.filter((e) => e instanceof NativeElementNode).indexOf(childNode);
            parentView.insertChild(childView, nativeIndex);
        }
        else {
            parentView.addChild(childView);
        }
        return;
    }
    if (parentView._addChildFromBuilder) {
        return parentView._addChildFromBuilder(childNode._nativeView.constructor.name, childView);
    }
    if (parentView instanceof ContentView) {
        parentView.content = childView;
        return;
    }
    throw new Error("Parent can't contain children: " + parentNode + ', ' + childNode);
}
function removeChild(parentNode, childNode) {
    if (!parentNode) {
        return;
    }
    if (!(parentNode instanceof NativeElementNode) || !(childNode instanceof NativeElementNode)) {
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
    }
    else if (parentView instanceof ContentView) {
        if (parentView.content === childView) {
            parentView.content = null;
        }
        if (childNode.nodeType === 8) {
            parentView._removeView(childView);
        }
    }
    else if (parentView instanceof View) {
        parentView._removeView(childView);
    }
    else {
        // throw new Error("Unknown parent type: " + parent);
    }
}
