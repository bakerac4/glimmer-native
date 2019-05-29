export class NativeModifier {
    constructor(element, state, args, dom) {
        this.element = element;
        this.state = state;
        this.args = args;
        this.dom = dom;
    }
}
export class NativeModifierDefinitionState {
    constructor(Klass) {
        if (Klass) {
            this.instance = new Klass();
        }
    }
}
export class NativeModifierManager {
    constructor() {
        this.installedElements = [];
        this.updatedElements = [];
        this.destroyedModifiers = [];
    }
    create(element, state, args, _dynamicScope, dom) {
        return new NativeModifier(element, state, args.capture(), dom);
    }
    getTag({ args: { tag } }) {
        return tag;
    }
    install({ element, args, dom, state }) {
        this.installedElements.push(element);
        let firstParam = args.positional.at(0);
        let param = firstParam !== undefined && firstParam.value();
        dom.setAttribute(element, 'data-modifier', `installed - ${param}`);
        if (state.instance && state.instance.didInsertElement) {
            state.instance.element = element;
            state.instance.didInsertElement(element, args.positional.value(), args.named.value());
        }
        return;
    }
    update({ element, args, dom, state }) {
        this.updatedElements.push(element);
        let firstParam = args.positional.at(0);
        let param = firstParam !== undefined && firstParam.value();
        dom.setAttribute(element, 'data-modifier', `updated - ${param}`);
        if (state.instance && state.instance.didUpdate) {
            state.instance.didUpdate(element, args.positional.value(), args.named.value());
        }
        return;
    }
    getDestructor(modifier) {
        return {
            destroy: () => {
                this.destroyedModifiers.push(modifier);
                let { element, dom, state } = modifier;
                if (state.instance && state.instance.willDestroyElement) {
                    state.instance.willDestroyElement(element);
                }
                dom.removeAttribute(element, 'data-modifier');
            },
        };
    }
}
