import { Page } from 'tns-core-modules/ui/page';

import NativeComponentResult from '../../glimmer/result';
import NativeViewElementNode from './NativeViewElementNode';

export default class PageElement extends NativeViewElementNode<Page> {
    __GlimmerNativeComponent__: NativeComponentResult;
    listViewItems: NativeComponentResult[];
    navigation: any;
    constructor() {
        super('page', Page);
    }
}
