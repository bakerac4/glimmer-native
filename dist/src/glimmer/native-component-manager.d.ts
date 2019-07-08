import { ComponentDefinition } from '@glimmer/component';
import { DefinitionState } from '@glimmer/component/dist/types/src/component-definition';
import { AotRuntimeResolver, ComponentManager as VMComponentManager, Invocation } from '@glimmer/interfaces';
import { PathReference, Tag } from '@glimmer/reference';
export declare const DESTROYING: unique symbol;
export declare const DESTROYED: unique symbol;
export declare class Bounds {
    private _bounds;
    constructor(__bounds: any);
    readonly firstNode: Node;
    readonly lastNode: Node;
}
export declare class ComponentStateBucket {
    name: string;
    component: any;
    private args;
    constructor(definition: any, args: any);
    readonly tag: Tag;
    namedArgsSnapshot(): any;
}
export default class NativeComponentManager implements VMComponentManager<ComponentStateBucket, ComponentDefinition> {
    getCapabilities(state: any): any;
    prepareArgs(): any;
    getAotStaticLayout({ name, handle, symbolTable }: DefinitionState, resolver: AotRuntimeResolver): Invocation;
    create(environment: any, definition: any, args: any, _dynamicScope: any, _caller: any, _hasDefaultBlock: any): ComponentStateBucket;
    getSelf(bucket: ComponentStateBucket): PathReference;
    didCreateElement(): void;
    didRenderLayout(bucket: any, bounds: any): void;
    didCreate(bucket: any): void;
    getTag(bucket: any): any;
    update(bucket: any): void;
    didUpdateLayout(): void;
    didUpdate(): void;
    getDestructor(bucket: any): {
        destroy(): void;
    };
}
