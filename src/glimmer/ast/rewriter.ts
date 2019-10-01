import { ASTPlugin, NodeVisitor, Syntax } from '@glimmer/syntax';

export class GlimmerRewriter implements ASTPlugin {
    syntax: Syntax;
    builder: any;
    print: any;
    visitor: NodeVisitor;
    templates = [];

    constructor(syntax: Syntax) {
        this.syntax = syntax;
        this.builder = syntax.builders;
        this.print = syntax.print;
        this.visitor = {
            Template: {
                exit: this.exit.bind(this)
            },
            ElementNode: this.ElementNode.bind(this)
        };
    }

    get name(): string {
        return 'ast-transform';
    }

    ElementNode(node) {
        if (node.tag === 'template' && node.attributes.find(({ name }) => name === 'name')) {
            this.templates.push(node);
            return null;
        }
    }

    templateCompileFunction(txt) {
        return btoa(JSON.stringify(txt));
    }
    exit(node) {
        this.templates.forEach((tpl) => {
            const name = tpl.attributes.find(({ name }) => name === 'name').value.chars;
            const template = this.builder.template(tpl.children);
            const compiledTemplate = this.templateCompileFunction(this.print(template));
            node.body.unshift(
                this.builder.mustache(this.builder.path('register-component'), [
                    this.builder.string(name),
                    this.builder.string(compiledTemplate)
                ])
            );
        });
    }
}
