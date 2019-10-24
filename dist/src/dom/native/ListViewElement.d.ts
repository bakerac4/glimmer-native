import GlimmerComponent from '@glimmer/component/dist/types/addon/-private/component';
import { Cursor } from '@glimmer/interfaces';
import { ItemEventData, ListView as NativeListView } from 'tns-core-modules/ui/list-view';
import { KeyedTemplate } from 'tns-core-modules/ui/page/page';
import { ElementNode } from '../../..';
import NativeElementNode from './NativeElementNode';
export default class ListViewElement extends NativeElementNode {
    template: any;
    items: any;
    numberViewsCreated: number;
    templates: {};
    constructor();
    registerTemplate(name?: string): void;
    renderItem(template: any, item: any): import("tns-core-modules/ui/page/page").View;
    updateListItem(args: ItemEventData): Promise<void>;
    _renderComponent(name: string, cursor: Cursor, compilable: number, data: {}): ElementNode;
    getItemTemplateComponent(name: any): GlimmerComponent;
    nativeView: NativeListView;
}
export declare class GlimmerKeyedTemplate implements KeyedTemplate {
    _key: any;
    constructor(key: any);
    readonly key: any;
    createView(): any;
}
