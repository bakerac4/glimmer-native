import { ComponentDefinition, RootReference } from '@glimmer/component';
import { DefinitionState } from '@glimmer/component/dist/types/src/component-definition';
import { AotRuntimeResolver, ComponentManager as VMComponentManager, Invocation } from '@glimmer/interfaces';
import { CONSTANT_TAG, PathReference, Tag } from '@glimmer/reference';

const EMPTY_SELF = new RootReference(null);
const NOOP_DESTROYABLE = { destroy() {} };
const DESTROYING = Symbol('destroying');
const DESTROYED = Symbol('destroyed');

export class Bounds {
    private _bounds: any;
    constructor(__bounds: any) {
        this._bounds = __bounds;
    }

    get firstNode(): Node {
        return this._bounds.firstNode() as Node;
    }

    get lastNode(): Node {
        return this._bounds.lastNode() as Node;
    }
}

export class ComponentStateBucket {
    public name: string;
    public component: any;
    private args: any;

    constructor(definition: any, args: any) {
        let { ComponentClass, name } = definition;
        this.args = args;

        if (ComponentClass) {
            if (ComponentClass.class !== undefined) {
                ComponentClass = ComponentClass.class;
            }

            this.component = new ComponentClass({
                args: this.namedArgsSnapshot(),
                debugName: name
            });
        }
    }

    get tag(): Tag {
        return this.args.tag;
    }

    namedArgsSnapshot() {
        let snapshot: any = this.args.named.value();
        return Object.freeze(snapshot);
    }
}

export default class NativeComponentManager implements VMComponentManager<ComponentStateBucket, ComponentDefinition> {
    getCapabilities(state: any) {
        return state.capabilities;
    }
    prepareArgs(): any {
        return null;
    }
    getAotStaticLayout({ name, handle, symbolTable }: DefinitionState, resolver: AotRuntimeResolver): Invocation {
        if (handle && symbolTable) {
            return {
                handle,
                symbolTable
            };
        }

        throw new Error('unimplemented getAotStaticLayout');
    }

    create(environment: any, definition: any, args: any, _dynamicScope: any, _caller: any, _hasDefaultBlock: any) {
        if (definition.ComponentClass) {
            return new ComponentStateBucket(definition, args.capture());
        }
    }
    getSelf(bucket: ComponentStateBucket): PathReference {
        if (bucket) {
            return new RootReference(bucket.component) as any;
        }
        return EMPTY_SELF as any;
    }
    didCreateElement() {}
    didRenderLayout(bucket: any, bounds: any) {
        if (!bucket) {
            return;
        }
        bucket.component.bounds = new Bounds(bounds);
    }
    didCreate(bucket: any) {
        console.log('in did created component manager');
        if (!bucket) {
            return;
        }
        console.log('in did created component manager - about to call didInsertElement');
        bucket.component.didInsertElement();
    }
    getTag(bucket: any) {
        if (!bucket) {
            return CONSTANT_TAG;
        }
        return bucket.tag;
    }
    update(bucket: any) {
        if (!bucket) {
            return;
        }
        bucket.component.args = bucket.namedArgsSnapshot();
    }
    didUpdateLayout() {}
    didUpdate() {}
    getDestructor(bucket: any) {
        if (!bucket) {
            return NOOP_DESTROYABLE;
        }

        return {
            destroy() {
                bucket.component[DESTROYING] = true;
                bucket.component.willDestroy();
                bucket.component[DESTROYED] = true;
            }
        };
    }
}
