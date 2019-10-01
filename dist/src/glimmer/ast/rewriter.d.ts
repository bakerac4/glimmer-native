import { ASTPlugin, NodeVisitor, Syntax } from '@glimmer/syntax';
export declare class GlimmerRewriter implements ASTPlugin {
    syntax: Syntax;
    builder: any;
    print: any;
    visitor: NodeVisitor;
    templates: any[];
    constructor(syntax: Syntax);
    readonly name: string;
    ElementNode(node: any): any;
    templateCompileFunction(txt: any): string;
    exit(node: any): void;
}
