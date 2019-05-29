import { Context } from '@glimmer/opcode-compiler';
import { artifacts } from '@glimmer/program';
import { AotRuntime, renderAot, renderSync } from '@glimmer/runtime';
import { launchEvent, on, run } from 'tns-core-modules/application';

import DocumentNode from './src/dom/nodes/DocumentNode';
import ElementNode from './src/dom/nodes/ElementNode';
import { registerElements } from './src/dom/setup-registry';
import GlimmerResolverDelegate from './src/glimmer/context';
import setupGlimmer from './src/glimmer/setup';

// import { setPropertyDidChange } from '@glimmer/component';
//Exports
export { ResolverDelegate } from './src/glimmer/context';
export { registerElements } from './src/dom/setup-registry';
export { default as DocumentNode } from './src/dom/nodes/DocumentNode';
export { default as ElementNode } from './src/dom/nodes/ElementNode';
export { default as Resolver } from './src/glimmer/resolver';
export { default as NativeCapabilities } from './src/glimmer/native-capabilities';
export {
    NativeModifierConstructor,
    NativeModifier,
    NativeModifierDefinitionState,
    NativeModifierInstance
} from './src/glimmer/native-modifier-manager';

// setPropertyDidChange(() => {
//     NativescriptGlimmer.scheduleRerender();
// });

export default class Application {
    public static document: DocumentNode;
    public static rootFrame: ElementNode;
    public static context: any;
    public artifacts: any;
    public aotRuntime: any;
    public rootName: string;
    // public result: any;
    // public _rendered: boolean;
    public _scheduled: boolean;
    public _rendering: boolean;
    public resolver: any;
    public resolverDelegate: any;
    public main: any;
    static resolver: any;
    static result: any;
    static _rendered: boolean;

    // public static result: any;
    // public static env: any;
    // public static aotRuntime: any;
    // public static rootFrame: ElementNode;
    // static _scheduled: boolean = false;
    // static _rendered: boolean = false;
    // static _rendering: boolean = false;
    // static context: any;
    // static document: DocumentNode;
    // static resolver: any;

    constructor(rootName: string, resolverDelegate: any, resolver: any) {
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
        // if we add this back in, we get that error
        Application.renderComponent(rootName, Application.rootFrame, null);

        // console.log('Context Created');
        // this.main = GlimmerResolverDelegate.lookupComponent(rootName).compilable.compile(this.context);
        // console.log('Main Created');
        // this.artifacts = artifacts(this.context);
        // console.log('Artifacts Created');
        // this.aotRuntime = AotRuntime(this.document as any, this.artifacts, resolver);
        // console.log('aotRuntime Created');
    }

    // setup(folder) {
    //     this.addTemplates(folder);
    //     this.addComponents(folder);
    // }

    // addTemplates(appFolder) {
    //     let templatesFile = appFolder.getFile('templates.json');
    //     let templates = templatesFile.readTextSync();
    //     // console.log(`Templates: ${templates}`);
    //     JSON.parse(templates).forEach((template) => {
    //         this.resolverDelegate.registerComponent(
    //             template.name,
    //             template.handle,
    //             template.source,
    //             template.capabilities
    //         );
    //     });
    // }

    // addComponents(appFolder) {
    //     let componentsFile = appFolder.getFile('components.json');
    //     let components = componentsFile.readTextSync();
    //     console.log(`About to resolve require`);
    //     JSON.parse(components).forEach((component) => {
    //         console.log(`About to resolve require`);
    //         const classFile = require(`../src/ui/components/${component.name}/component.ts`);
    //         this.resolver.registerComponent(component.name, classFile.default);
    //     });
    // }

    static renderComponent(name, containerElement, nextSibling = null) {
        // const state = State(data);
        const component = GlimmerResolverDelegate.lookupComponent(name).compilable.compile(Application.context);
        console.log('Main Created');
        const artifact = artifacts(Application.context);
        console.log('Artifacts Created');
        const aotRuntime = AotRuntime(Application.document as any, artifact, Application.resolver);
        const cursor = { element: containerElement ? containerElement : Application.rootFrame, nextSibling };
        let iterator = renderAot(aotRuntime, component, cursor);
        console.log('Iterator Created');
        try {
            const result = renderSync(aotRuntime.env, iterator);
            console.log('Render Sync');
            Application.result = result;
            Application._rendered = true;
        } catch (error) {
            console.log(`Error rendering component ${name}: ${error}`);
        }
    }

    boot() {
        const rootFrame = Application.rootFrame;
        return new Promise((resolve, reject) => {
            //wait for launch
            on(launchEvent, () => {
                // const cursor = { element: this.rootFrame, nextSibling: null } as Cursor;
                // let iterator = renderAot(this.aotRuntime, this.main, cursor);
                // console.log('Iterator Created');
                // try {
                //     const result = renderSync(this.aotRuntime.env, iterator);
                //     console.log('Render Sync');
                //     this.result = result;
                //     this._rendered = true;
                // } catch (error) {
                //     console.log(`Error rendering component ${name}: ${error}`);
                // }
                // this.renderComponent('HelloGlimmer', rootFrame);
                // this.renderComponent(this.rootName, this.rootFrame);
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
            } catch (e) {
                reject(e);
            }
        });
    }

    scheduleRerender(): void {
        if (this._scheduled || !Application._rendered) return;

        this._rendering = true;
        this._scheduled = true;
        setTimeout(async () => {
            this._scheduled = false;
            await this._rerender();
            this._rendering = false;
        }, 0);
    }

    protected async _rerender() {
        let { aotRuntime } = this;
        try {
            aotRuntime.env.begin();
            await Application.result.rerender();
            aotRuntime.env.commit();
            Application._rendered = true;
        } catch (error) {
            console.log(`Error in re-render: ${error}`);
        }
    }
}
