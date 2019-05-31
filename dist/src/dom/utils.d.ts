import ViewNode from './nodes/ViewNode';
export declare function isView(view: any): boolean;
export declare function isLayout(view: any): boolean;
export declare function isContentView(view: any): boolean;
export declare function insertChild(parentNode: ViewNode, childNode: ViewNode, atIndex?: number): any;
export declare function removeChild(parentNode: any, childNode: any): any;
