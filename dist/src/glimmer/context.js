import { precompile } from '@glimmer/compiler';
import { Component } from '@glimmer/opcode-compiler';
import { preprocess } from '@glimmer/syntax';
import { strip } from '@glimmer/util';
import AST from './ast/template';
// export interface ASTPluginEnvironment {
//     meta?: any;
//     syntax: Syntax;
// }
// export interface ASTPlugin {
//     name: string;
//     visitor: NodeVisitor;
// }
// export interface Syntax {
//     parse: typeof preprocess;
//     builders: typeof builders;
//     print: typeof print;
//     traverse: typeof traverse;
//     Walker: typeof Walker;
// }
// /**
//  * Ideally we precompile all the templates through a
//  * through a plugin at build time. This is done just
//  * for demo purposes.
//  */
export function Compilable(source) {
    const preprocessOptions = {
        mode: 'codemod'
    };
    const ast = preprocess(source, preprocessOptions);
    // const rewriter = new GlimmerRewriter({} as Syntax);
    // const transform = AST(ast);
    // traverse(ast, rewriter.visitor);
    // const template = AST(template1);
    // const compiled = TemplateCompiler.compile(ast);
    // const template2 = templateCompileFunction(source);
    // console.log('In Compilable: ' + source);
    let options = {
        meta: {},
        plugins: {
            ast: [AST]
        }
    };
    const precompiled = precompile(source, options);
    // console.log('Precompiled');
    const component = Component(precompiled);
    // console.log(`Compiled Component: ${component}`);
    return component;
}
export class ResolverDelegate {
    registerComponent(name, handle, source, capabilities) {
        // console.log(`addComponent: ${name}`);
        ResolverDelegate.components[name] = {
            source: strip `${source}`,
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
    static lookupComponent(name) {
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
    static lookupModifier(name) {
        if (name in ResolverDelegate.modifiers) {
            return ResolverDelegate.modifiers[name];
        }
    }
    static lookupHelper(name) {
        // console.log('in lookup helper');
        if (name in ResolverDelegate.helpers) {
            return ResolverDelegate.helpers[name];
        }
    }
}
ResolverDelegate.components = {};
ResolverDelegate.helpers = {};
ResolverDelegate.modifiers = {};
export default {
    lookupComponent: ResolverDelegate.lookupComponent,
    lookupHelper: ResolverDelegate.lookupHelper,
    lookupModifier: ResolverDelegate.lookupModifier
};
