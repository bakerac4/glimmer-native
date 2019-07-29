import { Page } from 'tns-core-modules/ui/page';
import NativeElementNode from './NativeElementNode';
export default class PageElement extends NativeElementNode {
    constructor() {
        super('page', Page, null);
    }
    get nativeView() {
        return super.nativeView;
    }
    set nativeView(view) {
        super.nativeView = view;
    }
}
