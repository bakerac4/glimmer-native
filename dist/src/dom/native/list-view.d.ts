import { ItemEventData } from 'tns-core-modules/ui/list-view';
import NativeElementNode from './ElementNode';
export default class ListView extends NativeElementNode {
    template: any;
    yieldItem: (item: any) => {};
    constructor();
    updateListItem(args: ItemEventData, template: any): void;
}
