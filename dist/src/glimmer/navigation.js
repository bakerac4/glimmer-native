// import FrameElement from "../dom//nodes/FrameElement";
// import { createElement, logger as log } from "./basicdom";
// import PageElement from "./native/PageElement";
// import NativeElementNode from "./native/NativeElementNode";
// export type FrameSpec = Frame | FrameElement | string
// export type PageSpec = typeof GlimmerComponent;
// export interface NavigationOptions {
//     page: PageSpec;
//     props?: any;
//     frame?: FrameSpec;
//     animated?: boolean;
//     backstackVisible?: boolean;
//     clearHistory?: boolean;
//     transition?: NavigationTransition;
//     transitionAndroid?: NavigationTransition;
//     transitioniOS?: NavigationTransition;
// }
// function resolveFrame(frameSpec?: FrameSpec): Frame {
//     let targetFrame: Frame;
//     if (!frameSpec) targetFrame = topmost();
//     if (frameSpec instanceof FrameElement) targetFrame = frameSpec.nativeView as Frame;
//     if (frameSpec instanceof Frame) targetFrame = frameSpec;
//     if (typeof frameSpec == "string") {
//         targetFrame = getFrameById(frameSpec)
//         if (!targetFrame) console.log(`Navigate could not find frame with id ${frameSpec}`)
//     }
//     return targetFrame;
// }
// interface ComponentInstanceInfo { element: ElementNode, pageInstance: GlimmerComponent }
// function resolveComponentElement(pageSpec: PageSpec, props?: any): ComponentInstanceInfo {
//     let dummy = createElement('fragment');
//     let pageInstance = new pageSpec({ target: dummy, props: props });
//     let element = dummy.firstElement() as NativeElementNode;
//     return { element, pageInstance }
// }
export function navigate(name) {
    // let GlimmerNative = NativescriptGlimmer;
    // // let targetFrame = resolveFrame();
    // // const document = new DocumentNode();
    // const newFrame = new ElementNode('frame');
    // // //setup a frame so we always have somewhere to hang our css
    // newFrame.setAttribute("id", name);
    // GlimmerNative.document.appendChild(newFrame);
    // // const context = Context(GlimmerResolverDelegate);
    // // const programArtifacts = artifacts(context);
    // // const aotRuntime = AotRuntime(document as any, programArtifacts, GlimmerNative.resolver);
    // // if (!targetFrame) {
    // //     throw new Error("navigate requires frame option to be a native Frame, a FrameElement, a frame Id, or null")
    // // }
    // const component = GlimmerResolverDelegate.lookupComponent(name).compilable.compile(GlimmerNative.context);
    // let cursor: Cursor = { element: newFrame as any, nextSibling: null };
    // const iterator = renderAot(GlimmerNative.aotRuntime, component, cursor);
    // try {
    //     console.log('About to render new result');
    //     const result = renderSync(GlimmerNative.aotRuntime.env, iterator);
    //     NativescriptGlimmer.result = result;
    //     NativescriptGlimmer._rendered = true;
    //     GlimmerNative.rootFrame.nativeView.navigate({
    //         create: () => {
    //             return newFrame.firstElement().nativeView
    //         }
    //     });
    //     console.log('New page rendered');
    // } catch(error) {
    //     console.log(`Error in initial render: ${error}`);
    // }
    // if (!(element instanceof PageElement))
    //     throw new Error("navigage requires a svelte component with a page element at the root")
    // let nativePage = element.nativeView;
    // const handler = (args: NavigatedData) => {
    //     if (args.isBackNavigation) {
    //         nativePage.off('navigatedFrom', handler)
    //         pageInstance.$destroy()
    //     }
    // }
    // nativePage.on('navigatedFrom', handler)
    // targetFrame.navigate({
    //     create: () => nativePage
    // });
    return null;
}
// export interface BackNavigationOptions {
//     frame?: FrameSpec;
//     to?: PageElement;
// }
// export function goBack(options: BackNavigationOptions = {}) {
//     let targetFrame = resolveFrame(options.frame);
//     if (!targetFrame) {
//         throw new Error("goback requires frame option to be a native Frame, a FrameElement, a frame Id, or null")
//     }
//     let backStackEntry: BackstackEntry = null;
//     if (options.to) {
//         backStackEntry = targetFrame.backStack.find(e => e.resolvedPage === options.to.nativeView);
//         if (!backStackEntry) {
//             throw new Error("Couldn't find the destination page in the frames backstack")
//         }
//     }
//     return targetFrame.goBack(backStackEntry);
// }
// export interface ShowModalOptions {
//     page: PageSpec
//     props?: any
//     android?: { cancelable: boolean }
//     ios?: { presentationStyle: any }
//     animated?: boolean
//     fullscreen?: boolean
//     stretched: boolean
// }
// const modalStack: ComponentInstanceInfo[] = []
// export function showModal<T>(modalOptions: ShowModalOptions): Promise<T> {
//     let { page, props = {}, ...options } = modalOptions;
//     //Get this before any potential new frames are created by component below
//     let modalLauncher = topmost().currentPage;
//     let componentInstanceInfo = resolveComponentElement(page, props);
//     let modalView: ViewBase = componentInstanceInfo.element.nativeView;
//     return new Promise((resolve, reject) => {
//         let resolved = false;
//         const closeCallback = (result: T) => {
//             if (resolved) return;
//             resolved = true;
//             try {
//                 componentInstanceInfo.pageInstance.$destroy(); //don't let an exception in destroy kill the promise callback
//             } finally {
//                 resolve(result);
//             }
//         }
//         modalStack.push(componentInstanceInfo);
//         modalLauncher.showModal(modalView, { ...options, context: {}, closeCallback })
//     });
// }
// export function closeModal(result: any): void {
//     let modalPageInstanceInfo = modalStack.pop();
//     modalPageInstanceInfo.element.nativeView.closeModal(result);
// }
