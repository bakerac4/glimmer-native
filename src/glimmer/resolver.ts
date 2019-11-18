import { DefinitionState } from '@glimmer/component/dist/types/src/component-definition';
import {
    AotRuntimeResolver,
    ComponentDefinition,
    Dict,
    Invocation,
    ModuleLocator,
    ProgramSymbolTable
} from '@glimmer/interfaces';
import { TEMPLATE_ONLY_COMPONENT } from '@glimmer/runtime';
import { unreachable } from '@glimmer/util';

import CAPABILITIES from './native-capabilities';
import NativeComponentManager from './native-component-manager';
import { NativeModifierDefinitionState, NativeModifierManager } from './native-modifier-manager';

export interface TemplateMeta {
    specifier: string;
}

export class NativeComponentDefinition implements ComponentDefinition {
    name: string;
    manager: NativeComponentManager;
    ComponentClass: any;
    handle: number;
    state: DefinitionState;
    symbolTable?: ProgramSymbolTable;

    constructor(
        name: string,
        manager: NativeComponentManager,
        ComponentClass: any,
        handle: number,
        symbolTable?: ProgramSymbolTable
    ) {
        this.name = name;
        this.manager = manager;
        this.ComponentClass = ComponentClass;
        this.handle = handle;
        this.state = {
            name,
            capabilities: CAPABILITIES,
            ComponentClass,
            handle,
            symbolTable
        };
    }
    toJSON() {
        return { GlimmerDebug: `<component-definition name="${this.name}">` };
    }
}

export default class Resolver implements AotRuntimeResolver {
    protected table: unknown[] = [];
    protected managers: Dict<NativeComponentManager> = {};

    resolve<U>(handle: number): U {
        // console.log('in resolver resolve');
        let value = this.table[handle];
        return value as U;
    }

    managerFor(managerId = 'main'): NativeComponentManager {
        let manager = this.managers[managerId];

        if (manager) {
            return manager;
        }
        manager = new NativeComponentManager();
        this.managers[managerId] = manager;
        return manager;
    }

    getInvocation(locator: ModuleLocator): Invocation {
        throw new Error('unimplemented getInvocation');
    }

    lookupComponent(name: string, referrer: TemplateMeta): NativeComponentDefinition {
        let definition: NativeComponentDefinition | null = null;
        this.table.forEach((component: NativeComponentDefinition) => {
            if (component.name === name) {
                definition = component;
            }
        });
        return definition;
    }

    lookupPartial(name: string, referrer: TemplateMeta): number {
        throw unreachable();
    }

    registerComponent(name: string, ComponentClass?: any): number {
        const handle = this.table.length;
        let manager = this.managerFor();
        const definition = new NativeComponentDefinition(name, manager, ComponentClass, handle);
        // const definition = (this.resolveComponentDefinition(ComponentClass as Factory<unknown>) as any);
        // definition.state.handle = handle;
        this.table.push(definition);
        return handle;
    }

    registerTemplateOnlyComponent(name): number {
        const handle = this.table.length;
        let manager = this.managerFor();
        this.table.push({ name: name, ComponentClass: TEMPLATE_ONLY_COMPONENT, manager });
        return handle;
    }

    registerHelper(helper: any): number {
        const handle = this.table.length;
        this.table.push(helper);
        return handle;
    }

    registerModifier(ModifierClass: any): number {
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
