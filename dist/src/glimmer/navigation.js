import { Frame, topmost } from 'tns-core-modules/ui/frame';
import Application from '../..';
import ElementNode from '../dom/nodes/ElementNode';
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
function resolveFrame(frameSpec) {
    let targetFrame;
    const document = Application.document;
    if (!frameSpec)
        targetFrame = topmost();
    if (frameSpec instanceof Frame)
        targetFrame = frameSpec;
    if (typeof frameSpec == 'string') {
        const node = resolveFrameNode(frameSpec);
        if (node) {
            targetFrame = node.nativeView;
        }
        if (!targetFrame)
            console.log(`Navigate could not find frame with id ${frameSpec}`);
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
export function navigate(name) {
    const frame = resolveFrameNode(name);
    if (frame) {
        topmost().navigate({
            create: () => {
                return frame.firstElement().nativeView;
            }
        });
    }
    else {
        const document = Application.document;
        const newFrame = new ElementNode('frame');
        newFrame.setAttribute('id', name);
        document.appendChild(newFrame);
        try {
            console.log('About to render new result');
            Application.renderComponent(name, newFrame);
            topmost().navigate({
                create: () => {
                    return newFrame.firstElement().nativeView;
                }
            });
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
        backStackEntry = targetFrame.backStack[0];
        if (!backStackEntry) {
            throw new Error("Couldn't find the destination page in the frames backstack");
        }
    }
    return targetFrame.goBack(backStackEntry);
}
