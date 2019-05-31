import { RootReference } from '@glimmer/component';
import { CONSTANT_TAG } from '@glimmer/reference';
const EMPTY_SELF = new RootReference(null);
const NOOP_DESTROYABLE = { destroy() { } };
const DESTROYING = Symbol('destroying');
const DESTROYED = Symbol('destroyed');
export class Bounds {
    constructor(__bounds) {
        this._bounds = __bounds;
    }
    get firstNode() {
        return this._bounds.firstNode();
    }
    get lastNode() {
        return this._bounds.lastNode();
    }
}
export class ComponentStateBucket {
    constructor(definition, args) {
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
    get tag() {
        return this.args.tag;
    }
    namedArgsSnapshot() {
        let snapshot = this.args.named.value();
        return Object.freeze(snapshot);
    }
}
export default class NativeComponentManager {
    getCapabilities(state) {
        return state.capabilities;
    }
    prepareArgs() {
        return null;
    }
    getAotStaticLayout({ name, handle, symbolTable }, resolver) {
        if (handle && symbolTable) {
            return {
                handle,
                symbolTable
            };
        }
        throw new Error('unimplemented getAotStaticLayout');
    }
    create(environment, definition, args, _dynamicScope, _caller, _hasDefaultBlock) {
        if (definition.ComponentClass) {
            return new ComponentStateBucket(definition, args.capture());
        }
    }
    getSelf(bucket) {
        if (bucket) {
            return new RootReference(bucket.component);
        }
        return EMPTY_SELF;
    }
    didCreateElement() { }
    didRenderLayout(bucket, bounds) {
        if (!bucket) {
            return;
        }
        bucket.component.bounds = new Bounds(bounds);
    }
    didCreate(bucket) {
        console.log('in did created component manager');
        if (!bucket) {
            return;
        }
        console.log('in did created component manager - about to call didInsertElement');
        bucket.component.didInsertElement();
    }
    getTag(bucket) {
        if (!bucket) {
            return CONSTANT_TAG;
        }
        return bucket.tag;
    }
    update(bucket) {
        if (!bucket) {
            return;
        }
        bucket.component.args = bucket.namedArgsSnapshot();
    }
    didUpdateLayout() { }
    didUpdate() { }
    getDestructor(bucket) {
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
