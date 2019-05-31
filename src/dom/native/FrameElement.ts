import { Frame } from 'tns-core-modules/ui/frame';

import NativeElementNode from './ElementNode';

export default class FrameElement extends NativeElementNode {
    constructor() {
        super('frame', Frame, null);
    }

    get nativeView(): Frame {
        return super.nativeView as Frame;
    }

    set nativeView(view: Frame) {
        super.nativeView = view;
    }
}
