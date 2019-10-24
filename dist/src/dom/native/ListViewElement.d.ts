import GlimmerComponent from '@glimmer/component/dist/types/addon/-private/component';
import { ItemEventData, ListView as NativeListView } from 'tns-core-modules/ui/list-view';
import { KeyedTemplate } from 'tns-core-modules/ui/page/page';
import NativeElementNode from './NativeElementNode';
export default class ListViewElement extends NativeElementNode {
    template: any;
    items: any;
    templates: {};
    constructor();
    registerTemplate(name?: string): void;
    updateListItem(args: ItemEventData): void;
    getItemTemplateComponent(name: any): GlimmerComponent;
    nativeView: NativeListView;
}
export declare class GlimmerKeyedTemplate implements KeyedTemplate {
    _key: any;
    constructor(key: any);
    readonly key: any;
    createView(): any;
}
