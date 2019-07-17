import { ItemEventData } from 'tns-core-modules/ui/list-view';
import ElementNode from '../nodes/ElementNode';
export default class ListView extends ElementNode {
    template: any;
    yieldItem: (item: any) => {};
    constructor();
    updateListItem(args: ItemEventData): void;
    readonly itemTemplateComponent: typeof import("@glimmer/component/dist/types/addon/-private/component").default;
    nativeView: ListView;
}
