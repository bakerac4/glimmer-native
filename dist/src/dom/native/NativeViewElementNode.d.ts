import { EventData, View } from 'tns-core-modules/ui/page';
import ViewNode from '../nodes/ViewNode';
import NativeElementNode, { NativeElementPropConfig } from './NativeElementNode';
interface IStyleProxy {
    setProperty(propertyName: string, value: string, priority?: string): void;
    removeProperty(property: string): void;
    animation: string;
    cssText: string;
}
export declare function registerNativeViewElement<T extends View>(elementName: string, resolver: () => new () => T, parentProp?: string, propConfig?: NativeElementPropConfig): void;
export declare type EventListener = (args: any) => void;
export default class NativeViewElementNode<T extends View> extends NativeElementNode<T> {
    style: IStyleProxy;
    component: any;
    constructor(tagName: string, viewClass: new () => T, setsParentProp?: string, propConfig?: NativeElementPropConfig);
    setStyle(property: string, value: string | number): void;
    nativeView: T;
    addEventListener(event: string, handler: EventListener): void;
    removeEventListener(event: string, handler?: EventListener): void;
    onInsertedChild(childNode: ViewNode, index: number): any;
    onRemovedChild(childNode: ViewNode): void;
    dispatchEvent(event: EventData): void;
}
export {};
