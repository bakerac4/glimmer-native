export default class NativeComponentResult {
    constructor(name, result, state, runtime) {
        this.name = name;
        this.result = result;
        this.state = state;
        this.runtime = runtime;
    }
    update(state) {
        this.state.update(state);
        this.runtime.env.begin();
        this.result.rerender();
        this.runtime.env.commit();
    }
    toJSON() {
        return { GlimmerDebug: `<component-result name="${this.name}">` };
    }
}
