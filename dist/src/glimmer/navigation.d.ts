import { Frame, NavigationTransition } from 'tns-core-modules/ui/frame';
import FrameElement from '../dom/native/FrameElement';
export declare type FrameType = Frame | FrameElement | string;
export interface NavigationOptions {
    frame: FrameType;
    context?: any;
    animated?: boolean;
    backstackVisible?: boolean;
    clearHistory?: boolean;
    transition?: NavigationTransition;
    transitionAndroid?: NavigationTransition;
    transitioniOS?: NavigationTransition;
}
export declare function navigate(componentName: string, model: any, options: NavigationOptions): any;
export interface BackNavigationOptions {
    frame?: any;
    to?: any;
}
/**
 * When calling back, we use nativescript to do the navigation. Previously we have set up an event on the Page's native view
 * to listen for when we leave the page (This happens in `navigate`). If we leave the page and its the user is performing a back navigation
 * we reset to the correct result and runtime, and call re-render. This re-attaches Glimmer VM to the DOM
 *
 * @export
 * @param {BackNavigationOptions} [options={}]
 * @returns
 */
export declare function back(options?: BackNavigationOptions): Promise<any>;
export interface ShowModalOptions {
    context?: any;
    android?: {
        cancelable: boolean;
    };
    ios?: {
        presentationStyle: any;
    };
    animated?: boolean;
    fullscreen?: boolean;
    stretched: boolean;
}
export declare function showModal<T>(componentName: string, model: any, options?: ShowModalOptions): Promise<T>;
export declare function closeModal(returnValue?: any): void;
declare class Navigation {
    static instance: Navigation;
    static pages: any;
    constructor();
    navigate: typeof navigate;
    back: typeof back;
    showModal: typeof showModal;
    closeModal: typeof closeModal;
}
declare const instance: Navigation;
export default instance;
