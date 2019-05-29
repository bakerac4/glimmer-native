export declare function Compilable(source: any): import("@glimmer/interfaces").CompilableTemplate<import("@glimmer/interfaces").ProgramSymbolTable>;
export declare class ResolverDelegate {
    static components: any;
    static helpers: any;
    static modifiers: any;
    registerComponent(name: any, handle: any, source: any, capabilities: any): void;
    registerHelper(name: any, handle: any): void;
    registerModifier(name: any, handle: any): void;
    static lookupComponent(name: any): {
        handle: any;
        source: any;
        compilable: import("@glimmer/interfaces").CompilableTemplate<import("@glimmer/interfaces").ProgramSymbolTable>;
        capabilities: any;
    };
    static lookupModifier(name: any): any;
    static lookupHelper(name: any): any;
}
declare const _default: {
    lookupComponent: typeof ResolverDelegate.lookupComponent;
    lookupHelper: typeof ResolverDelegate.lookupHelper;
    lookupModifier: typeof ResolverDelegate.lookupModifier;
};
export default _default;
