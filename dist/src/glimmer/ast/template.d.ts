export declare function templateCompileFunction(txt: any): string;
export default function (a: any): {
    name: string;
    visitor: {
        Template: {
            exit(node: any): void;
        };
        ElementNode(node: any): any;
    };
};
