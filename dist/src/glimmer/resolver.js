import { TEMPLATE_ONLY_COMPONENT } from '@glimmer/runtime';
import { NativeModifierManager, NativeModifierDefinitionState } from './native-modifier-manager';
import NativeComponentManager from './native-component-manager';
import CAPABILITIES from './native-capabilities';
import { unreachable } from '@glimmer/util';
class NativeComponentDefinition {
    constructor(name, manager, ComponentClass, handle) {
        this.name = name;
        this.manager = manager;
        this.ComponentClass = ComponentClass;
        this.handle = handle;
        this.state = {
            name,
            capabilities: CAPABILITIES,
            ComponentClass,
            handle
        };
    }
    toJSON() {
        return { GlimmerDebug: `<component-definition name="${this.name}">` };
    }
}
export default class Resolver {
    constructor() {
        this.table = [];
        this.managers = {};
    }
    resolve(handle) {
        console.log('in resolver resolve');
        let value = this.table[handle];
        return (value);
    }
    managerFor(managerId = 'main') {
        let manager = this.managers[managerId];
        if (manager) {
            return manager;
        }
        manager = new NativeComponentManager();
        this.managers[managerId] = manager;
        return manager;
    }
    getInvocation(locator) {
        throw new Error('unimplemented getInvocation');
    }
    lookupComponent(name, referrer) {
        let definition = null;
        this.table.forEach((component) => {
            if (component.name === name) {
                definition = component;
            }
        });
        return definition;
    }
    lookupPartial(name, referrer) {
        throw unreachable();
    }
    registerComponent(name, ComponentClass) {
        const handle = this.table.length;
        let manager = this.managerFor();
        const definition = new NativeComponentDefinition(name, manager, ComponentClass, handle);
        // const definition = (this.resolveComponentDefinition(ComponentClass as Factory<unknown>) as any);
        // definition.state.handle = handle;
        this.table.push(definition);
        return handle;
    }
    registerTemplateOnlyComponent() {
        const handle = this.table.length;
        this.table.push(TEMPLATE_ONLY_COMPONENT);
        return handle;
    }
    registerHelper(helper) {
        const handle = this.table.length;
        this.table.push(helper);
        return handle;
    }
    registerModifier(ModifierClass) {
        const handle = this.table.length;
        let state = new NativeModifierDefinitionState(ModifierClass);
        let manager = new NativeModifierManager();
        this.table.push({
            state,
            manager
        });
        return handle;
    }
}
