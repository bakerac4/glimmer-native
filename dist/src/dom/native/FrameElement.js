import { Frame } from 'tns-core-modules/ui/frame';
import NativeElementNode from './ElementNode';
export default class FrameElement extends NativeElementNode {
    constructor() {
        super('frame', Frame, null);
    }
    get nativeView() {
        return super.nativeView;
    }
    set nativeView(view) {
        super.nativeView = view;
    }
}
