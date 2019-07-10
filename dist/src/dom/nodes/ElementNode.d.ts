import { KeyframeAnimation } from 'tns-core-modules/ui/animation/keyframe-animation';
import ViewNode from './ViewNode';
export default class ElementNode extends ViewNode {
    style: any;
    animations: Map<string, KeyframeAnimation>;
    oldAnimations: KeyframeAnimation[];
    constructor(tagName: any);
    animate(options: any): void;
    getParentPage(): ElementNode;
    addAnimation(animation: string): void;
    removeAnimation(animation: string): void;
    animation: string;
    setAttribute(key: any, value: any): void;
    appendChild(childNode: any): void;
    insertBefore(childNode: any, referenceNode: any): void;
    removeChild(childNode: any): void;
}
