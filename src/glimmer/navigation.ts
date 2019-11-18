import {
    BackstackEntry,
    Frame,
    getFrameById,
    NavigatedData,
    NavigationTransition,
    topmost
} from 'tns-core-modules/ui/frame';
import { Page } from 'tns-core-modules/ui/page';

import Application from '../..';
import FrameElement from '../dom/native/FrameElement';
import NativeViewElementNode from '../dom/native/NativeViewElementNode';
import PageElement from '../dom/native/PageElement';

export type FrameSpec = Frame | FrameElement | string;
export interface NavigationOptions {
    props?: any;
    frame?: FrameSpec;

    animated?: boolean;
    backstackVisible?: boolean;
    clearHistory?: boolean;
    transition?: NavigationTransition;
    transitionAndroid?: NavigationTransition;
    transitioniOS?: NavigationTransition;
}
function resolveFrame(frameSpec?: FrameSpec): Frame {
    let targetFrame: Frame;
    if (!frameSpec) targetFrame = topmost();
    if (frameSpec instanceof FrameElement) targetFrame = frameSpec.nativeView as Frame;
    if (frameSpec instanceof Frame) targetFrame = frameSpec;
    if (typeof frameSpec == 'string') {
        targetFrame = getFrameById(frameSpec);
        if (!targetFrame) console.error(`Navigate could not find frame with id ${frameSpec}`);
    }
    return targetFrame;
}

export function navigate(componentName: string, model: any, options: NavigationOptions): any {
    let { frame } = options;
    const target = resolveFrame(frame);
    let backTarget = target.currentPage;
    const targetNode = target.get('__GlimmerNativeElement__');
    if (!componentName) {
        throw new Error('Must have a valid component name (@target) to perform navigation');
    }
    if (targetNode) {
        const element = Application.renderPage(componentName, targetNode, null, { model }) as PageElement;
        element.navigation = {
            componentName,
            targetNode,
            model,
            glimmerResult: Application.result,
            runtime: Application.aotRuntime,
            backTarget
        };

        if (!(element.nativeView instanceof Page)) {
            throw new Error('Navigate requires a Glimmer Component with a page element at the root');
        }

        const onNavigatedFrom = async (args: NavigatedData, element: any) => {
            if (args.isBackNavigation) {
                const pageToDestroy = element as NativeViewElementNode<Page>;
                const pageToGoBackTo = (pageToDestroy as PageElement).navigation.backTarget;
                const { glimmerResult, runtime } = pageToGoBackTo.__GlimmerNativeElement__.navigation;
                element.nativeView.off('navigatedFrom', onNavigatedFrom);
                Application.result = glimmerResult;
                Application.aotRuntime = runtime;
                Application._rerender();
            }
        };

        element.nativeView.on('navigatingFrom', function(args) {
            onNavigatedFrom(args, element);
        });

        target.navigate({
            ...options,
            create: () => {
                return element.nativeView;
            }
        });

        const dispose = element.nativeView.disposeNativeView;
        element.nativeView.disposeNativeView = (...args) => {
            if (element.listViewItems) {
                element.listViewItems.forEach((component) => {
                    component.destroy();
                });
                element.listViewItems = [];
            }

            if (element.component) {
                element.component.destroy();
                element.component = null;
                element.navigation = null;
            }

            dispose.call(element.nativeView, args);
        };
    }

    return null;
}

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
export async function back(options: BackNavigationOptions = {}) {
    // let { frame } = options;
    let targetFrame = resolveFrame(options.frame) as Frame;
    if (!targetFrame) {
        throw new Error('goback requires frame option to be a native Frame, a FrameElement, a frame Id, or null');
    }
    let backStackEntry: BackstackEntry = null;
    if (options.to) {
        backStackEntry = targetFrame.backStack.find((e) => e.resolvedPage === options.to.nativeView);
        if (!backStackEntry) {
            throw new Error("Couldn't find the destination page in the frames backstack");
        }
    }
    // let currentPage = targetFrame.currentPage as any;
    // currentPage.__GlimmerNativeElement__.destroy();
    return targetFrame.goBack(backStackEntry);
}

export interface ShowModalOptions {
    context?: any;
    android?: { cancelable: boolean };
    ios?: { presentationStyle: any };
    animated?: boolean;
    fullscreen?: boolean;
    stretched: boolean;
}

const modalStack: any[] = [];

export function showModal<T>(componentName: string, model: any, options?: ShowModalOptions): Promise<T> {
    //Get this before any potential new frames are created by component below
    const target = resolveFrame();
    let modalLauncher = target.currentPage;
    let backTarget = target.currentPage;
    const targetNode = target.get('__GlimmerNativeElement__');
    const element = Application.renderPage(componentName, targetNode, null, { model }) as PageElement;
    element.navigation = {
        componentName,
        targetNode,
        model,
        glimmerResult: Application.result,
        runtime: Application.aotRuntime,
        backTarget
    };

    return new Promise((resolve, reject) => {
        let resolved = false;
        const closeCallback = (result: T) => {
            if (resolved) return;
            resolved = true;
            try {
                const pageToDestroy = element as NativeViewElementNode<Page>;
                const pageToGoBackTo = (pageToDestroy as PageElement).navigation.backTarget;
                const { glimmerResult, runtime } = pageToGoBackTo.__GlimmerNativeElement__.navigation;
                element.component.destroy();
                element.component = null;
                element.navigation = null;
                Application.result = glimmerResult;
                Application.aotRuntime = runtime;
                Application._rerender();
            } finally {
                resolve(result);
            }
        };
        modalStack.push(element);
        modalLauncher.showModal(element.nativeView, { ...options, context: model, closeCallback });
    });
}

export function closeModal(returnValue?): void {
    let modalPageInstanceInfo = modalStack.pop();
    if (modalPageInstanceInfo) {
        modalPageInstanceInfo.nativeView.closeModal(returnValue);
    }
}

class Navigation {
    static instance: Navigation;
    static pages: any;
    constructor() {
        if (!Navigation.instance) {
            Navigation.instance = this;
        }

        return Navigation.instance;
    }

    navigate = navigate;
    back = back;
    showModal = showModal;
    closeModal = closeModal;
}

const instance = new Navigation();
Object.freeze(instance);

export default instance;
