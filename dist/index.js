var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Context } from '@glimmer/opcode-compiler';
import { artifacts } from '@glimmer/program';
import { AotRuntime, renderAot, renderSync } from '@glimmer/runtime';
import { launchEvent, on, run } from 'tns-core-modules/application';
import DocumentNode from './src/dom/nodes/DocumentNode';
import ElementNode from './src/dom/nodes/ElementNode';
import { registerElements } from './src/dom/setup-registry';
import GlimmerResolverDelegate, { Compilable } from './src/glimmer/context';
import setupGlimmer from './src/glimmer/setup';
//Exports
export { ResolverDelegate } from './src/glimmer/context';
export { registerElements } from './src/dom/setup-registry';
export { default as DocumentNode } from './src/dom/nodes/DocumentNode';
export { default as ElementNode } from './src/dom/nodes/ElementNode';
export { default as Resolver } from './src/glimmer/resolver';
export { default as NativeCapabilities } from './src/glimmer/native-capabilities';
export { NativeModifier, NativeModifierDefinitionState } from './src/glimmer/native-modifier-manager';
export default class Application {
    constructor(rootName, resolverDelegate, resolver) {
        registerElements();
        setupGlimmer(resolverDelegate, resolver);
        Application.document = new DocumentNode();
        Application.rootFrame = new ElementNode('frame');
        Application.rootFrame.setAttribute('id', 'app-root-frame');
        Application.document.appendChild(Application.rootFrame);
        Application.context = Context(GlimmerResolverDelegate);
        Application.resolver = resolver;
        this.rootName = rootName;
        this.resolverDelegate = resolverDelegate;
        Application.renderComponent(rootName, Application.rootFrame, null);
    }
    static renderComponent(name, containerElement, nextSibling = null) {
        //This seems less than ideal. Need other solutions
        let main = Compilable(`<${name} />`).compile(Application.context);
        // const component = GlimmerResolverDelegate.lookupComponent(name).compilable.compile(Application.context);
        const artifact = artifacts(Application.context);
        Application.aotRuntime = AotRuntime(Application.document, artifact, Application.resolver);
        const cursor = { element: containerElement ? containerElement : Application.rootFrame, nextSibling };
        let iterator = renderAot(Application.aotRuntime, main, cursor);
        try {
            const result = renderSync(Application.aotRuntime.env, iterator);
            console.log('Application Rendered');
            Application.result = result;
            Application._rendered = true;
        }
        catch (error) {
            console.log(`Error rendering component ${name}: ${error}`);
        }
    }
    boot() {
        const rootFrame = Application.rootFrame;
        return new Promise((resolve, reject) => {
            //wait for launch
            on(launchEvent, () => {
                // This is super hacky and likely needs to be abstracted away.
                rootFrame.nativeView.navigate({
                    create: () => {
                        return rootFrame.firstElement().nativeView;
                    }
                });
            });
            try {
                run({
                    create() {
                        return rootFrame.nativeView;
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
    scheduleRerender() {
        if (this._scheduled || !Application._rendered)
            return;
        this._rendering = true;
        this._scheduled = true;
        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            this._scheduled = false;
            yield this._rerender();
            this._rendering = false;
        }), 0);
    }
    _rerender() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                Application.aotRuntime.env.begin();
                yield Application.result.rerender();
                Application.aotRuntime.env.commit();
                Application._rendered = true;
                console.log('Result Re-rendered');
            }
            catch (error) {
                console.log(`Error in re-render: ${error}`);
            }
        });
    }
}
