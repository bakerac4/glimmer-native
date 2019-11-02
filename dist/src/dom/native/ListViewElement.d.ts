import GlimmerComponent from '@glimmer/component/dist/types/addon/-private/component';
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
    getItemTemplateComponent(name: any): GlimmerComponent;
    nativeView: ListView;
    onInsertedChild(childNode: ViewNode, index: number): void;
    onRemovedChild(childNode: ViewNode): void;
}
export declare class GlimmerKeyedTemplate {
    _key: string;
    _templateEl: TemplateElement;
    constructor(key: string, templateEl: TemplateElement);
    readonly component: any;
    readonly key: string;
    createView(): View;
}
