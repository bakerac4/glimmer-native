import { View } from 'tns-core-modules/ui/core/view';
import { ItemEventData, ListView } from 'tns-core-modules/ui/list-view';
import ViewNode from '../nodes/ViewNode';
import NativeElementNode from './NativeElementNode';
import TemplateElement from './TemplateElement';
export default class ListViewElement extends NativeElementNode {
    template: any;
    items: any;
    numberViewsCreated: number;
    templates: {};
    constructor();
    updateListItem(args: ItemEventData): Promise<void>;
    nativeView: ListView;
    onInsertedChild(childNode: ViewNode, index: number): void;
    onRemovedChild(childNode: ViewNode): void;
}
export declare class GlimmerKeyedTemplate {
    _key: string;
    _templateEl: TemplateElement;
    _index: number;
    constructor(key: string, templateEl: TemplateElement);
    readonly component: number;
    readonly args: any;
    readonly key: string;
    createView(): View;
}
