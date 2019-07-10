import { Frame, NavigationTransition } from 'tns-core-modules/ui/frame';
export declare type FrameType = Frame | string;
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
export declare function goBack(options?: BackNavigationOptions): any;
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
export declare function closeModal(): void;
