var templates = [];

export function templateCompileFunction(txt) {
    return btoa(JSON.stringify(txt));
}

// class Transform {
//     b: any;
//     p: any;
//     constructor(ast: AST.Template) {
//         this.b = ast.syntax.builders;
//         this.p = ast.syntax.print;
//     }
//     name = 'ast-transform';
//     visitor: NodeVisitor = {
//         Template: {
//             exit(node) {
//                 templates.forEach((tpl) => {
//                     const name = tpl.attributes.find(({ name }) => name === 'name').value.chars;
//                     const template = b.template(tpl.children);
//                     const compiledTemplate = templateCompileFunction(p(template));
//                     node.body.unshift(
//                         b.mustache(b.path('register-component'), [b.string(name), b.string(compiledTemplate)])
//                     );
//                 });
//                 // node.body.unshift(templates[0]);
//                 //console.log('Template');
//             }
//         },
//         ElementNode(node) {
//             if (node.tag === 'template' && node.attributes.find(({ name }) => name === 'name')) {
//                 templates.push(node);
//                 return null;
//             }
//         }
//     };
// }
export default function(a) {
    const b = a.syntax.builders;
    const p = a.syntax.print;
    return {
        name: 'ast-transform',

        visitor: {
            Template: {
                exit(node) {
                    templates.forEach((tpl) => {
                        const name = tpl.attributes.find(({ name }) => name === 'name').value.chars;
                        const template = b.template(tpl.children);
                        const compiledTemplate = templateCompileFunction(p(template));
                        node.body.unshift(
                            b.mustache(b.path('register-component'), [b.string(name), b.string(compiledTemplate)])
                        );
                    });
                    // node.body.unshift(templates[0]);
                    //console.log('Template');
                }
            },
            ElementNode(node) {
                if (node.tag === 'template' && node.attributes.find(({ name }) => name === 'name')) {
                    templates.push(node);
                    return null;
                }
            }
        }
    };
}
