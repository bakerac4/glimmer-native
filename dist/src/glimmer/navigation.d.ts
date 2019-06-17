import { Frame } from 'tns-core-modules/ui/frame';
export declare type FrameSpec = Frame | string;
export declare function navigate(name: string): any;
export interface BackNavigationOptions {
    frame?: any;
    to?: any;
}
export declare function goBack(options?: BackNavigationOptions): any;
