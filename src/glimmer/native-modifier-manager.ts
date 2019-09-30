import {
    CapturedArguments,
    Destroyable,
    Dict,
    DynamicScope,
    GlimmerTreeChanges,
    ModifierManager,
    VMArguments
} from '@glimmer/interfaces';
import { Tag } from '@glimmer/reference';

/**
  The CustomModifierManager allows addons to provide custom modifier
  implementations that integrate seamlessly into Ember. This is accomplished
  through a delegate, registered with the custom modifier manager, which
  implements a set of hooks that determine modifier behavior.
  To create a custom modifier manager, instantiate a new CustomModifierManager
  class and pass the delegate as the first argument:
  ```js
  let manager = new CustomModifierManager({
    // ...delegate implementation...
  });
  ```
  ## Delegate Hooks
  Throughout the lifecycle of a modifier, the modifier manager will invoke
  delegate hooks that are responsible for surfacing those lifecycle changes to
  the end developer.
  * `createModifier()` - invoked when a new instance of a modifier should be created
  * `installModifier()` - invoked when the modifier is installed on the element
  * `updateModifier()` - invoked when the arguments passed to a modifier change
  * `destroyModifier()` - invoked when the modifier is about to be destroyed
*/

export interface NativeModifierConstructor {
    new (): NativeModifierInstance;
}
export class NativeModifier {
    constructor(
        public element: any,
        public state: NativeModifierDefinitionState,
        public args: CapturedArguments,
        public dom: GlimmerTreeChanges
    ) {}
}

export class NativeModifierDefinitionState {
    instance?: NativeModifierInstance;
    constructor(Klass?: NativeModifierConstructor) {
        if (Klass) {
            this.instance = new Klass();
        }
    }
}

export interface NativeModifierInstance {
    element?: any;
    didInsertElement(element: any, _params: unknown[], _hash: Dict<unknown>): void;
    didUpdate(element: any, _params: unknown[], _hash: Dict<unknown>): void;
    willDestroyElement(element: any): void;
}

export class NativeModifierManager implements ModifierManager<NativeModifier, NativeModifierDefinitionState> {
    public installedElements: any[] = [];
    public updatedElements: any[] = [];
    public destroyedModifiers: NativeModifier[] = [];

    create(
        element: any,
        state: NativeModifierDefinitionState,
        args: VMArguments,
        _dynamicScope: DynamicScope,
        dom: GlimmerTreeChanges
    ) {
        return new NativeModifier(element, state, args.capture(), dom);
    }

    getTag({ args: { tag } }: NativeModifier): Tag {
        return tag;
    }

    install({ element, args, dom, state }: NativeModifier) {
        this.installedElements.push(element);
        let firstParam = args.positional.at(0);
        let param = firstParam !== undefined && firstParam.value();
        // dom.setAttribute(element, 'data-modifier', `installed - ${param}`);

        if (state.instance && state.instance.didInsertElement) {
            state.instance.element = element;
            state.instance.didInsertElement(element, args.positional.value(), args.named.value());
        }

        return;
    }

    update({ element, args, dom, state }: NativeModifier) {
        this.updatedElements.push(element);
        let firstParam = args.positional.at(0);
        let param = firstParam !== undefined && firstParam.value();
        // dom.setAttribute(element, 'data-modifier', `updated - ${param}`);

        if (state.instance && state.instance.didUpdate) {
            state.instance.didUpdate(element, args.positional.value(), args.named.value());
        }

        return;
    }

    getDestructor(modifier: NativeModifier): Destroyable {
        return {
            destroy: () => {
                this.destroyedModifiers.push(modifier);
                let { element, dom, state } = modifier;
                if (state.instance && state.instance.willDestroyElement) {
                    state.instance.willDestroyElement(element);
                }
                // dom.removeAttribute(element, 'data-modifier');
            }
        };
    }
}
