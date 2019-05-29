import { Context } from '@glimmer/opcode-compiler';
import { artifacts } from '@glimmer/program';
import { AotRuntime, renderAot, renderSync } from '@glimmer/runtime';
import { launchEvent, on, run } from 'tns-core-modules/application';

import DocumentNode from './lib/dom/nodes/DocumentNode';
import ElementNode from './lib/dom/nodes/ElementNode';
import { registerElements } from './lib/dom/setup-registry';
import GlimmerResolverDelegate from './lib/glimmer/context';
import setupGlimmer from './lib/glimmer/setup';

// import { setPropertyDidChange } from '@glimmer/component';

//Exports
export { ResolverDelegate } from './lib/glimmer/context';
export { registerElements } from './lib/dom/setup-registry';
export { default as DocumentNode } from './lib/dom/nodes/DocumentNode';
export { default as ElementNode } from './lib/dom/nodes/ElementNode';
export { default as Resolver } from './lib/glimmer/resolver';
export { default as NativeComponent } from './lib/glimmer/native-component';
export { default as NativeCapabilities } from './lib/glimmer/native-capabilities';
export { NativeModifierConstructor, NativeModifier, NativeModifierDefinitionState, NativeModifierInstance } from './lib/glimmer/native-modifier-manager';

// setPropertyDidChange(() => {
//     NativescriptGlimmer.scheduleRerender();
// });

export default class Application {
    public document: DocumentNode;
    public rootFrame: ElementNode;
    public context: any;
    public artifacts: any;
    public aotRuntime: any;
    public rootName: string;
    public result: any;
    public _rendered: boolean;
    public _scheduled: boolean;
    public _rendering: boolean;

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
        this.document = new DocumentNode();
        this.rootFrame = new ElementNode('frame');
        this.rootFrame.setAttribute("id", "app-root-frame");
        this.document.appendChild(this.rootFrame);
        this.context = Context(GlimmerResolverDelegate);
        this.artifacts = artifacts(this.context); 
        this.aotRuntime = AotRuntime(this.document, this.artifacts, resolver);
        this.rootName = rootName;
    }

    registerInitializer(initializer) {

    }

    renderComponent(name, containerElement) {
        const cursor = { element: containerElement, nextSibling: null };
        const main = GlimmerResolverDelegate.lookupComponent(name).compilable.compile(this.context);
        let iterator = renderAot(this.aotRuntime, main, cursor);
        try {
            const result = renderSync(this.aotRuntime.env, iterator);
            this.result = result;
            this._rendered = true;
        } catch(error) {
            console.log(`Error rendering component ${ name }: ${error}`);
        }
    }

    boot() {
        return new Promise((resolve, reject) => {
            //wait for launch
            on(launchEvent, () => {
                // this.renderComponent(this.rootName, this.rootFrame);
                // This is super hacky and likely needs to be abstracted away.
                this.rootFrame.nativeView.navigate({
                    create: () => {
                        return this.rootFrame.firstElement().nativeView
                    }
                });
            })
            try {
                run({
                    create() {
                        return this.rootFrame.nativeView;
                    }
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    scheduleRerender(): void {
        if (this._scheduled || !this._rendered) return;

        this._rendering = true;
        this._scheduled = true;
        setTimeout(async () => {
            this._scheduled = false;
            await this._rerender();
            this._rendering = false;
        }, 0);
    }

    protected async _rerender() {
        let { aotRuntime, result } = this;
        try {
            aotRuntime.env.begin();
            await result.rerender();
            aotRuntime.env.commit();
            this._rendered = true;
        } catch (error) {
            console.log(`Error in re-render: ${error}`);
        }
    }
}
