import { Tag } from '@glimmer/reference';
import { Dict, ModifierManager, GlimmerTreeChanges, Destroyable, DynamicScope, VMArguments, CapturedArguments } from '@glimmer/interfaces';
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
export declare class NativeModifier {
    element: any;
    state: NativeModifierDefinitionState;
    args: CapturedArguments;
    dom: GlimmerTreeChanges;
    constructor(element: any, state: NativeModifierDefinitionState, args: CapturedArguments, dom: GlimmerTreeChanges);
}
export declare class NativeModifierDefinitionState {
    instance?: NativeModifierInstance;
    constructor(Klass?: NativeModifierConstructor);
}
export interface NativeModifierInstance {
    element?: any;
    didInsertElement(element: any, _params: unknown[], _hash: Dict<unknown>): void;
    didUpdate(element: any, _params: unknown[], _hash: Dict<unknown>): void;
    willDestroyElement(element: any): void;
}
export declare class NativeModifierManager implements ModifierManager<NativeModifier, NativeModifierDefinitionState> {
    installedElements: any[];
    updatedElements: any[];
    destroyedModifiers: NativeModifier[];
    create(element: any, state: NativeModifierDefinitionState, args: VMArguments, _dynamicScope: DynamicScope, dom: GlimmerTreeChanges): NativeModifier;
    getTag({ args: { tag } }: NativeModifier): Tag;
    install({ element, args, dom, state }: NativeModifier): void;
    update({ element, args, dom, state }: NativeModifier): void;
    getDestructor(modifier: NativeModifier): Destroyable;
}
