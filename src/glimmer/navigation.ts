import { BackstackEntry, Frame, NavigatedData, NavigationTransition, topmost } from 'tns-core-modules/ui/frame';
import { Page } from 'tns-core-modules/ui/page';

import Application, { NativeElementNode } from '../..';
import { createElement } from '../dom/element-registry';
import FrameElement from '../dom/native/FrameElement';
import ElementNode from '../dom/nodes/ElementNode';

export type FrameType = Frame | FrameElement | string;
// import { createElement, logger as log } from "./basicdom";
// import PageElement from "./native/PageElement";
// import NativeElementNode from "./native/NativeElementNode";
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

function resolveFrame(frame?: FrameType): Frame {
    let targetFrame: Frame;
    if (!frame) targetFrame = topmost();
    if (frame instanceof FrameElement) targetFrame = frame.nativeView as Frame;
    if (frame instanceof Frame) targetFrame = frame;
    if (typeof frame == 'string') {
        const node = resolveFrameNode(frame);
        if (node) {
            targetFrame = node.nativeView;
        }
        if (!targetFrame) console.log(`Navigate could not find frame with id ${frame}`);
    }
    return targetFrame;
}

function resolveFrameNode(name: string): ElementNode {
    let targetFrame: ElementNode;
    const document = Application.document;
    targetFrame = document.childNodes
        ? document.childNodes.find((node) => {
              return node.nativeView ? node.getAttribute('id') === name : false;
          })
        : undefined;
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
        const element = Application.renderPage(componentName, targetNode, null, { model }) as any;
        element._meta.component = {
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
                const target = element as NativeElementNode;
                const page = (target as any)._meta.component.backTarget;
                const { glimmerResult, runtime } = page.__GlimmerNativeElement__._meta.component;
                element.nativeView.off('navigatedFrom', onNavigatedFrom);
                //Now destroy the old element
                // await Application.result.destroy();
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

        const { glimmerResult } = element._meta.component;
        const dispose = element.nativeView.disposeNativeView;
        element.nativeView.disposeNativeView = (...args) => {
            if (glimmerResult) {
                glimmerResult.destroy();
            }
            element._meta.component = null;
            dispose.call(element.nativeView, args);
        };

        // if (options.clearHistory) {
        //     const page = (element as any)._meta.component.backTarget;
        //     const { glimmerResult } = page.__GlimmerNativeElement__._meta.component;
        //     // element.nativeView.off('navigatedFrom', onNavigatedFrom);
        //     //Now destroy the old element
        //     glimmerResult.destroy();
        // }
    } else {
        const document = Application.document;
        const newFrame = new ElementNode('frame');
        newFrame.setAttribute('id', name);
        document.appendChild(newFrame);

        try {
            console.log('About to render new result');
            const element = Application.renderPage(componentName, newFrame, null, { model });
            const handler = (args: NavigatedData) => {
                if (args.isBackNavigation) {
                    element.nativeView.off('navigatedFrom', handler);
                    // const destructor = Application.resolver.managerFor().getDestructor()
                    // destructor.destroy();
                }
            };
            element.nativeView.on('navigatedFrom', handler);
            topmost().navigate({
                ...options,
                create: () => {
                    return element.nativeView;
                }
            });
            console.log('New page rendered');
        } catch (error) {
            console.log(`Error in initial render: ${error}`);
        }
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
    let frame = createElement('frame');
    const targetNode = target.get('__GlimmerNativeElement__');
    const element = Application.renderPage(componentName, frame, null, {
        model
    });
    element._meta.component = {
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
                const target = element as any;
                const page = target._meta.component.backTarget;
                const { glimmerResult, runtime } = page.__GlimmerNativeElement__._meta.component;
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
