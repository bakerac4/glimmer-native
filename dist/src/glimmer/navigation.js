var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Frame, topmost } from 'tns-core-modules/ui/frame';
import { Page } from 'tns-core-modules/ui/page';
import Application from '../..';
import FrameElement from '../dom/native/FrameElement';
import ElementNode from '../dom/nodes/ElementNode';
function resolveFrame(frame) {
    let targetFrame;
    if (!frame)
        targetFrame = topmost();
    if (frame instanceof FrameElement)
        targetFrame = frame.nativeView;
    if (frame instanceof Frame)
        targetFrame = frame;
    if (typeof frame == 'string') {
        const node = resolveFrameNode(frame);
        if (node) {
            targetFrame = node.nativeView;
        }
        if (!targetFrame)
            console.log(`Navigate could not find frame with id ${frame}`);
    }
    return targetFrame;
}
function resolveFrameNode(name) {
    let targetFrame;
    const document = Application.document;
    targetFrame = document.childNodes
        ? document.childNodes.find((node) => {
            return node.nativeView ? node.getAttribute('id') === name : false;
        })
        : undefined;
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
        const element = Application.renderComponent(componentName, targetNode, null, { model });
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
        const onNavigatedFrom = (args, element) => __awaiter(this, void 0, void 0, function* () {
            if (args.isBackNavigation) {
                const target = element;
                const page = target._meta.component.backTarget;
                const { glimmerResult, runtime } = page.__GlimmerNativeElement__._meta.component;
                element.nativeView.off('navigatedFrom', onNavigatedFrom);
                Application.result = glimmerResult;
                Application.aotRuntime = runtime;
                Application._rerender();
            }
        });
        element.nativeView.on('navigatingFrom', function (args) {
            onNavigatedFrom(args, element);
        });
        target.navigate(Object.assign({}, options, { create: () => {
                return element.nativeView;
            } }));
    }
    else {
        const document = Application.document;
        const newFrame = new ElementNode('frame');
        newFrame.setAttribute('id', name);
        document.appendChild(newFrame);
        try {
            console.log('About to render new result');
            const element = Application.renderComponent(componentName, newFrame, null, { model });
            const handler = (args) => {
                if (args.isBackNavigation) {
                    element.nativeView.off('navigatedFrom', handler);
                    const destructor = Application.resolver.managerFor().getDestructor();
                    destructor.destroy();
                }
            };
            element.nativeView.on('navigatedFrom', handler);
            topmost().navigate(Object.assign({}, options, { create: () => {
                    return element.nativeView;
                } }));
            console.log('New page rendered');
        }
        catch (error) {
            console.log(`Error in initial render: ${error}`);
        }
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
        let currentPage = targetFrame.currentPage;
        currentPage.__GlimmerNativeElement__.destroy();
        return targetFrame.goBack(backStackEntry);
    });
}
const modalStack = [];
export function showModal(componentName, model, options) {
    //Get this before any potential new frames are created by component below
    let modalLauncher = topmost().currentPage;
    let frame = new ElementNode('frame');
    const element = Application.renderComponent(componentName, frame, null, {
        model
    });
    return new Promise((resolve, reject) => {
        let resolved = false;
        const closeCallback = (result) => {
            if (resolved)
                return;
            resolved = true;
            try {
                console.log('modal closed');
                // frame.parentNode.removeChild(frame);
            }
            finally {
                resolve(result);
            }
        };
        modalStack.push(element);
        modalLauncher.showModal(element.nativeView, Object.assign({}, options, { context: model, closeCallback }));
    });
}
export function closeModal() {
    let modalPageInstanceInfo = modalStack.pop();
    modalPageInstanceInfo.nativeView.closeModal();
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
