import { EPOCH } from '@glimmer/reference';
import { BackstackEntry, Frame, NavigatedData, NavigationTransition, topmost } from 'tns-core-modules/ui/frame';
import { Page } from 'tns-core-modules/ui/page';

import Application from '../..';
import ElementNode from '../dom/nodes/ElementNode';

export type FrameType = Frame | string;
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

export function navigate(componentName: string, options: NavigationOptions): any {
    let { frame } = options;
    const target = resolveFrame(frame);
    const targetNode = target.get('__GlimmerNativeElement__');
    if (!componentName) {
        throw new Error('Must have a valid component name (@target) to perform navigation');
    }

    if (targetNode) {
        const element = Application.renderComponent(componentName, targetNode, null, options.context);
        if (!(element.nativeView instanceof Page)) {
            throw new Error('Navigate requires a Glimmer Component with a page element at the root');
        }

        const handler = async (args: NavigatedData) => {
            if (args.isBackNavigation) {
                element.nativeView.off('navigatedFrom', handler);
                EPOCH.inner.validate(0);
                // try {
                //     // Application.result.destroy();
                //     // Application.aotRuntime.env.begin();

                //     // Application.aotRuntime.env.commit();
                //     await Application.result.rerender();
                //     Application._rendered = true;
                //     console.log('Result Re-rendered');
                // } catch (error) {
                //     console.log(`Error in re-render: ${error}`);
                // }
            }
        };
        element.nativeView.on('navigatedFrom', handler);

        target.navigate({
            ...options,
            create: () => {
                return element.nativeView;
            }
        });
    } else {
        const document = Application.document;
        const newFrame = new ElementNode('frame');
        newFrame.setAttribute('id', name);
        document.appendChild(newFrame);

        try {
            console.log('About to render new result');
            const element = Application.renderComponent(componentName, newFrame, null, options.context);
            const handler = (args: NavigatedData) => {
                if (args.isBackNavigation) {
                    element.nativeView.off('navigatedFrom', handler);
                    const destructor = Application.resolver.managerFor().getDestructor();
                    destructor.destroy();
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

export function goBack(options: BackNavigationOptions = {}) {
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

export function showModal<T>(componentName: string, options: ShowModalOptions): Promise<T> {
    //Get this before any potential new frames are created by component below
    let modalLauncher = topmost().currentPage;

    const element = Application.renderComponent(
        componentName,
        modalLauncher.get('__GlimmerNativeElement__'),
        null,
        options.context
    );

    return new Promise((resolve, reject) => {
        let resolved = false;
        const closeCallback = (result: T) => {
            if (resolved) return;
            resolved = true;
            try {
                console.log('test');
            } finally {
                resolve(result);
            }
        };
        modalStack.push(element);
        modalLauncher.showModal(element.nativeView, { ...options, context: options.context, closeCallback });
    });
}

export function closeModal(result: any): void {
    let modalPageInstanceInfo = modalStack.pop();
    modalPageInstanceInfo.element.nativeView.closeModal(result);
}
