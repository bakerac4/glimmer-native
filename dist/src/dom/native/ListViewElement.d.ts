import GlimmerComponent from '@glimmer/component/dist/types/addon/-private/component';
import { Cursor } from '@glimmer/interfaces';
import { ItemEventData, ListView as NativeListView } from 'tns-core-modules/ui/list-view';
import { ElementNode } from '../../..';
import NativeElementNode from './NativeElementNode';
export default class ListViewElement extends NativeElementNode {
    template: any;
    items: any;
    numberViewsCreated: number;
    constructor();
    updateListItem(args: ItemEventData): Promise<void>;
    _renderComponent(name: string, cursor: Cursor, compilable: number, data: {}): ElementNode;
    readonly itemTemplateComponent: GlimmerComponent;
    nativeView: NativeListView;
}
