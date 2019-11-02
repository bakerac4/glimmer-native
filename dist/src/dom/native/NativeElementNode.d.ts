import ElementNode from '../nodes/ElementNode';
import ViewNode from '../nodes/ViewNode';
export declare enum NativeElementPropType {
    Value = 0,
    Array = 1,
    ObservableArray = 2
}
export interface NativeElementPropConfig {
    [key: string]: NativeElementPropType;
}
export default class NativeElementNode<T> extends ElementNode {
    _nativeElement: T;
    propAttribute: string;
    propConfig: NativeElementPropConfig;
    _normalizedKeys: Map<string, string>;
    constructor(tagName: string, elementClass: new () => T, setsParentProp?: string, propConfig?: NativeElementPropConfig);
    nativeElement: T;
    getAttribute(fullkey: string): any;
    onInsertedChild(childNode: ViewNode, index: number): void;
    onRemovedChild(childNode: ViewNode): void;
    setAttribute(fullkey: string, value: any): void;
}
export declare function registerNativeConfigElement<T>(elementName: string, resolver: () => new () => T, parentProp?: string, propConfig?: NativeElementPropConfig): void;
