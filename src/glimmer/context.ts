import { precompile, TemplateCompiler } from '@glimmer/compiler';
import { Component } from '@glimmer/opcode-compiler';
import { preprocess, traverse } from '@glimmer/syntax';
import { strip } from '@glimmer/util';

import AST from './ast/template';

// /**
//  * Ideally we precompile all the templates through a
//  * through a plugin at build time. This is done just
//  * for demo purposes.
//  */
export function Compilable(source: any) {
    const ast = preprocess(source);
    const transform = AST(ast);
    traverse(ast, transform.visitor);
    // const template = AST(template1);
    const compiled = TemplateCompiler.compile(ast);

    // const template2 = templateCompileFunction(source);
    // console.log('In Compilable: ' + source);
    const precompiled = precompile(source);
    // console.log('Precompiled');
    const component = Component(precompiled);
    // console.log(`Compiled Component: ${component}`);
    return component;
}

export class ResolverDelegate {
    public static components: any = {};
    public static helpers: any = {};
    public static modifiers: any = {};

    registerComponent(name, handle, source, capabilities) {
        // console.log(`addComponent: ${name}`);
        ResolverDelegate.components[name] = {
            source: strip`${source}`,
            handle,
            capabilities
        };
        // console.log(`ResolverDelegate Components ${ResolverDelegate.components}`);
    }

    registerHelper(name, handle) {
        ResolverDelegate.helpers[name] = handle;
        // console.log(ResolverDelegate.helpers);
    }

    registerModifier(name, handle) {
        ResolverDelegate.modifiers[name] = handle;
    }

    static lookupComponent(name: any) {
        // console.log(`lookupComponent: ${name}`);
        let component = ResolverDelegate.components[name];
        if (component === null) {
            return null;
        }
        // console.log(`component found: ${component}`);
        //source should now be compiled
        let { handle, source, capabilities } = component;
        return {
            handle,
            source,
            compilable: Component(source),
            capabilities
        };
    }

    static lookupModifier(name: any) {
        if (name in ResolverDelegate.modifiers) {
            return ResolverDelegate.modifiers[name];
        }
    }

    static lookupHelper(name: any) {
        // console.log('in lookup helper');
        if (name in ResolverDelegate.helpers) {
            return ResolverDelegate.helpers[name];
        }
    }
}

export default {
    lookupComponent: ResolverDelegate.lookupComponent,
    lookupHelper: ResolverDelegate.lookupHelper,
    lookupModifier: ResolverDelegate.lookupModifier
};
