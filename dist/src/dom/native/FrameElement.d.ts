import { Frame } from 'tns-core-modules/ui/frame';
import ViewNode from '../nodes/ViewNode';
import NativeViewElementNode from './NativeViewElementNode';
export default class FrameElement extends NativeViewElementNode<Frame> {
    constructor();
    setAttribute(key: string, value: any): void;
    onInsertedChild(childNode: ViewNode, index: number): void;
}
