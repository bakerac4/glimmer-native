import { Frame, topmost } from 'tns-core-modules/ui/frame';
import { Page } from 'tns-core-modules/ui/page';
import Application from '../..';
import ElementNode from '../dom/nodes/ElementNode';
function resolveFrame(frame) {
    let targetFrame;
    if (!frame)
        targetFrame = topmost();
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
export function navigate(componentName, options) {
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
            const element = Application.renderComponent(componentName, newFrame, null, options.context);
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
export function goBack(options = {}) {
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
    return targetFrame.goBack(backStackEntry);
}
const modalStack = [];
export function showModal(componentName, options) {
    //Get this before any potential new frames are created by component below
    let modalLauncher = topmost().currentPage;
    const element = Application.renderComponent(componentName, modalLauncher.get('__GlimmerNativeElement__'), null, options.context);
    return new Promise((resolve, reject) => {
        let resolved = false;
        const closeCallback = (result) => {
            if (resolved)
                return;
            resolved = true;
            try {
                console.log('test');
            }
            finally {
                resolve(result);
            }
        };
        modalStack.push(element);
        modalLauncher.showModal(element.nativeView, Object.assign({}, options, { context: options.context, closeCallback }));
    });
}
export function closeModal(result) {
    let modalPageInstanceInfo = modalStack.pop();
    modalPageInstanceInfo.element.nativeView.closeModal(result);
}
