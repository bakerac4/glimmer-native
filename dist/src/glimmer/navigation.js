var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Frame, getFrameById, topmost } from 'tns-core-modules/ui/frame';
import { Page } from 'tns-core-modules/ui/page';
import Application from '../..';
import FrameElement from '../dom/native/FrameElement';
function resolveFrame(frameSpec) {
    let targetFrame;
    if (!frameSpec)
        targetFrame = topmost();
    if (frameSpec instanceof FrameElement)
        targetFrame = frameSpec.nativeView;
    if (frameSpec instanceof Frame)
        targetFrame = frameSpec;
    if (typeof frameSpec == 'string') {
        targetFrame = getFrameById(frameSpec);
        if (!targetFrame)
            console.error(`Navigate could not find frame with id ${frameSpec}`);
    }
    return targetFrame;
}
export function navigate(componentName, model, options) {
    let { frame } = options;
    const target = resolveFrame(frame);
    let backTarget = target.currentPage;
    const targetNode = target.get('__GlimmerNativeElement__');
    if (!componentName) {
        throw new Error('Must have a valid component name (@target) to perform navigation');
    }
    if (targetNode) {
        const element = Application.renderPage(componentName, targetNode, null, { model });
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
        const onNavigatedFrom = (args, element) => __awaiter(this, void 0, void 0, function* () {
            if (args.isBackNavigation) {
                const pageToDestroy = element;
                const pageToGoBackTo = pageToDestroy.navigation.backTarget;
                const { glimmerResult, runtime } = pageToGoBackTo.__GlimmerNativeElement__.navigation;
                element.nativeView.off('navigatedFrom', onNavigatedFrom);
                Application.result = glimmerResult;
                Application.aotRuntime = runtime;
                Application._rerender();
            }
        });
        element.nativeView.on('navigatingFrom', function (args) {
            onNavigatedFrom(args, element);
        });
        target.navigate(Object.assign(Object.assign({}, options), { create: () => {
                return element.nativeView;
            } }));
        const dispose = element.nativeView.disposeNativeView;
        element.nativeView.disposeNativeView = (...args) => {
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
/**
 * When calling back, we use nativescript to do the navigation. Previously we have set up an event on the Page's native view
 * to listen for when we leave the page (This happens in `navigate`). If we leave the page and its the user is performing a back navigation
 * we reset to the correct result and runtime, and call re-render. This re-attaches Glimmer VM to the DOM
 *
 * @export
 * @param {BackNavigationOptions} [options={}]
 * @returns
 */
export function back(options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        // let { frame } = options;
        let targetFrame = resolveFrame(options.frame);
        if (!targetFrame) {
            throw new Error('goback requires frame option to be a native Frame, a FrameElement, a frame Id, or null');
        }
        let backStackEntry = null;
        if (options.to) {
            backStackEntry = targetFrame.backStack.find((e) => e.resolvedPage === options.to.nativeView);
            if (!backStackEntry) {
                throw new Error("Couldn't find the destination page in the frames backstack");
            }
        }
        // let currentPage = targetFrame.currentPage as any;
        // currentPage.__GlimmerNativeElement__.destroy();
        return targetFrame.goBack(backStackEntry);
    });
}
const modalStack = [];
export function showModal(componentName, model, options) {
    //Get this before any potential new frames are created by component below
    const target = resolveFrame();
    let modalLauncher = target.currentPage;
    let backTarget = target.currentPage;
    const targetNode = target.get('__GlimmerNativeElement__');
    const element = Application.renderPage(componentName, targetNode, null, { model });
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
        const closeCallback = (result) => {
            if (resolved)
                return;
            resolved = true;
            try {
                const pageToDestroy = element;
                const pageToGoBackTo = pageToDestroy.navigation.backTarget;
                const { glimmerResult, runtime } = pageToGoBackTo.__GlimmerNativeElement__.navigation;
                element.component.destroy();
                element.component = null;
                element.navigation = null;
                Application.result = glimmerResult;
                Application.aotRuntime = runtime;
                Application._rerender();
            }
            finally {
                resolve(result);
            }
        };
        modalStack.push(element);
        modalLauncher.showModal(element.nativeView, Object.assign(Object.assign({}, options), { context: model, closeCallback }));
    });
}
export function closeModal(returnValue) {
    let modalPageInstanceInfo = modalStack.pop();
    if (modalPageInstanceInfo) {
        modalPageInstanceInfo.nativeView.closeModal(returnValue);
    }
}
class Navigation {
    constructor() {
        this.navigate = navigate;
        this.back = back;
        this.showModal = showModal;
        this.closeModal = closeModal;
        if (!Navigation.instance) {
            Navigation.instance = this;
        }
        return Navigation.instance;
    }
}
const instance = new Navigation();
Object.freeze(instance);
export default instance;
