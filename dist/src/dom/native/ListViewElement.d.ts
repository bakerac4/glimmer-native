import { View } from 'tns-core-modules/ui/core/view';
import { ItemEventData, ListView } from 'tns-core-modules/ui/list-view';
import ViewNode from '../nodes/ViewNode';
import NativeViewElementNode from './NativeViewElementNode';
import TemplateElement from './TemplateElement';
export default class ListViewElement extends NativeViewElementNode<ListView> {
    template: any;
    items: any;
    numberViewsCreated: number;
    templates: {};
    constructor();
    updateListItem(args: ItemEventData): Promise<void>;
    get nativeView(): ListView;
    set nativeView(view: ListView);
    onInsertedChild(childNode: ViewNode, index: number): void;
    onRemovedChild(childNode: ViewNode): void;
}
export declare class GlimmerKeyedTemplate {
    _key: string;
    _templateEl: TemplateElement;
    _index: number;
    _component: number;
    constructor(key: string, templateEl: TemplateElement);
    get component(): number;
    get args(): Readonly<{
        src: string;
    }>;
    get key(): string;
    createView(): View;
}
