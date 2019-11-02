import { KeyframeAnimation } from 'tns-core-modules/ui/animation/keyframe-animation';
import { LayoutBase } from 'tns-core-modules/ui/layouts/layout-base';
import { ContentView, View } from 'tns-core-modules/ui/page';
import { CssAnimationParser } from 'tns-core-modules/ui/styling/css-animation-parser';
import { registerElement } from '../element-registry';
import NativeElementNode from './NativeElementNode';
function camelize(kebab) {
    return kebab.replace(/[\-]+(\w)/g, (m, l) => l.toUpperCase());
}
export function registerNativeViewElement(elementName, resolver, parentProp = null, propConfig = {}) {
    registerElement(elementName, () => new NativeViewElementNode(elementName, resolver(), parentProp, propConfig));
}
// A NativeViewElementNode, wraps a native View and handles style, event dispatch, and native view hierarchy management.
export default class NativeViewElementNode extends NativeElementNode {
    constructor(tagName, viewClass, setsParentProp = null, propConfig = {}) {
        super(tagName, viewClass, setsParentProp, propConfig);
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
            console.debug(`Adding animation ${animation}`);
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
            console.debug(`Removing animation ${animation}`);
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
                console.debug(`setting animation ${value}`);
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
                console.debug('got css text');
                return getStyleAttribute();
            },
            set cssText(value) {
                console.debug('set css text');
                setStyleAttribute(value);
            }
        };
    }
    /* istanbul ignore next */
    setStyle(property, value) {
        console.debug(`setStyle ${this} ${property} ${value}`);
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
        return this.nativeElement;
    }
    set nativeView(view) {
        this.nativeElement = view;
    }
    /* istanbul ignore next */
    addEventListener(event, handler) {
        console.debug(`add event listener ${this} ${event}`);
        this.nativeView.on(event, handler);
    }
    /* istanbul ignore next */
    removeEventListener(event, handler) {
        console.debug(`remove event listener ${this} ${event}`);
        this.nativeView.off(event, handler);
    }
    onInsertedChild(childNode, index) {
        super.onInsertedChild(childNode, index);
        if (!(childNode instanceof NativeViewElementNode)) {
            return;
        }
        //if we are a property value, then skip adding to parent
        if (childNode.propAttribute)
            return;
        const parentView = this.nativeView;
        const childView = childNode.nativeView;
        if (!parentView || !childView) {
            return;
        }
        //use the builder logic if we aren't being dynamic, to catch config items like <actionbar> that are not likely to be toggled
        if (index < 0 && parentView._addChildFromBuilder) {
            parentView._addChildFromBuilder(childView.constructor.name, childView);
            return;
        }
        if (parentView instanceof LayoutBase) {
            if (index >= 0) {
                //our dom includes "textNode" and "commentNode" which does not appear in the nativeview's children.
                //we recalculate the index required for the insert operation by only including native view element nodes in the count
                //that aren't property setter nodes
                let nativeIndex = this.childNodes
                    .filter((e) => e instanceof NativeViewElementNode && !e.propAttribute)
                    .indexOf(childNode);
                parentView.insertChild(childView, nativeIndex);
            }
            else {
                parentView.addChild(childView);
            }
            return;
        }
        // we aren't a layout view, but we were given an index, try the _addChildFromBuilder first
        if (parentView._addChildFromBuilder) {
            return parentView._addChildFromBuilder(childView.constructor.name, childView);
        }
        if (parentView instanceof ContentView) {
            parentView.content = childView;
            return;
        }
        throw new Error("Parent can't contain children: " + this + ', ' + childNode);
    }
    onRemovedChild(childNode) {
        super.onRemovedChild(childNode);
        if (!(childNode instanceof NativeViewElementNode)) {
            return;
        }
        //childnodes with propAttributes aren't added to native views
        if (childNode.propAttribute)
            return;
        if (!this.nativeView || !childNode.nativeView) {
            return;
        }
        const parentView = this.nativeView;
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
            console.warn('Unknown parent view type: ' + parentView);
        }
    }
    dispatchEvent(event) {
        if (this.nativeView) {
            //nativescript uses the EventName while dom uses Type
            event.eventName = event.type;
            this.nativeView.notify(event);
        }
    }
}
