import { EventData, View } from 'tns-core-modules/ui/page';
import ElementNode from '../nodes/ElementNode';
import ViewNode from '../nodes/ViewNode';
interface IStyleProxy {
    setProperty(propertyName: string, value: string, priority?: string): void;
    removeProperty(property: string): void;
    animation: string;
    cssText: string;
}
export interface ComponentMeta {
    skipAddToDom?: boolean;
    insertChild?: (parent: ViewNode, child: ViewNode, index: number) => void;
    removeChild?: (parent: ViewNode, child: ViewNode) => void;
}
export declare type EventListener = (args: any) => void;
export default class NativeElementNode extends ElementNode {
    style: IStyleProxy;
    _nativeView: View;
    _meta: ComponentMeta;
    constructor(tagName: string, viewClass: typeof View, meta?: ComponentMeta);
    setStyle(property: string, value: string | number): void;
    nativeView: View;
    readonly meta: ComponentMeta;
    addEventListener(event: string, handler: EventListener): void;
    removeEventListener(event: string, handler?: EventListener): void;
    getAttribute(fullkey: string): any;
    onInsertedChild(childNode: ViewNode, index: number): void;
    onRemovedChild(childNode: ViewNode): void;
    setAttribute(fullkey: string, value: any): void;
    dispatchEvent(event: EventData): void;
}
export {};
