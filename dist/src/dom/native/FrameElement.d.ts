import { Frame } from 'tns-core-modules/ui/frame';
import ViewNode from '../nodes/ViewNode';
import NativeElementNode from './NativeElementNode';
export default class FrameElement extends NativeElementNode {
    constructor();
    setAttribute(key: string, value: any): void;
    nativeView: Frame;
    appendChild(childNode: ViewNode): void;
}
