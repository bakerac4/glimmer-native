var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { precompile } from '@glimmer/compiler';
import { Context } from '@glimmer/opcode-compiler';
import { artifacts } from '@glimmer/program';
import { AotRuntime, renderAot, renderSync, TEMPLATE_ONLY_COMPONENT } from '@glimmer/runtime';
import { launchEvent, on, run } from 'tns-core-modules/application';
import { registerElement } from './src/dom/element-registry';
import DocumentNode from './src/dom/nodes/DocumentNode';
import ElementNode from './src/dom/nodes/ElementNode';
import { registerElements } from './src/dom/setup-registry';
import GlimmerResolverDelegate, { Compilable, ResolverDelegate } from './src/glimmer/context';
import Resolver from './src/glimmer/resolver';
import setupGlimmer from './src/glimmer/setup';
//Exports
export { ResolverDelegate } from './src/glimmer/context';
export { registerElements } from './src/dom/setup-registry';
export { default as DocumentNode } from './src/dom/nodes/DocumentNode';
export { default as ElementNode } from './src/dom/nodes/ElementNode';
export { default as Resolver } from './src/glimmer/resolver';
export { default as NativeCapabilities } from './src/glimmer/native-capabilities';
export { NativeModifier, NativeModifierDefinitionState } from './src/glimmer/native-modifier-manager';
export { goBack } from './src/glimmer/navigation';
export default class Application {
    constructor(appFolder, components) {
        registerElements();
        const resolverDelegate = new ResolverDelegate();
        const resolver = new Resolver();
        Application.resolver = resolver;
        Application.resolverDelegate = resolverDelegate;
        this.parseTemplates(appFolder);
        this.registerState(components);
        setupGlimmer(resolverDelegate, resolver);
        Application.document = new DocumentNode();
        Application.rootFrame = new ElementNode('frame');
        Application.rootFrame.setAttribute('id', 'root');
        Application.document.appendChild(Application.rootFrame);
        Application.context = Context(GlimmerResolverDelegate);
    }
    renderMain(name, containerElement, nextSibling = null) {
        if (!containerElement) {
            containerElement = Application.rootFrame;
        }
        let main = Compilable(`<${name} />`).compile(Application.context);
        Application._renderComponent(name, containerElement, nextSibling, main);
    }
    static renderComponent(name, containerElement, nextSibling = null) {
        let component = Compilable(`<${name} />`).compile(Application.context);
        // const component = GlimmerResolverDelegate.lookupComponent(name).compilable.compile(Application.context);
        Application._renderComponent(name, containerElement, nextSibling, component);
    }
    static _renderComponent(name, containerElement, nextSibling, compilable) {
        const artifact = artifacts(Application.context);
        Application.aotRuntime = AotRuntime(Application.document, artifact, Application.resolver);
        const cursor = { element: containerElement ? containerElement : Application.rootFrame, nextSibling };
        let iterator = renderAot(Application.aotRuntime, compilable, cursor);
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
    parseTemplates(folder) {
        let templatesFile = folder.getFile('templates.json');
        let templates = templatesFile.readTextSync();
        JSON.parse(templates).forEach((template) => {
            Application.resolverDelegate.registerComponent(template.name, template.handle, template.source, template.capabilities);
        });
    }
    registerState(components) {
        return __awaiter(this, void 0, void 0, function* () {
            components.forEach((component) => {
                Application.resolver.registerComponent(component.name, component.class);
            });
        });
    }
    registerComponent(name, value) {
        registerElement(name, value);
        const handle = Application.resolver.registerTemplateOnlyComponent();
        Application.resolverDelegate.registerComponent(name, handle, precompile(`<${name.toLowerCase()} ...attributes> {{yield}} </${name.toLowerCase()}>`), TEMPLATE_ONLY_COMPONENT);
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
Application.outsideComponents = [];
