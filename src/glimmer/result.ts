import { AotRuntimeContext, RenderResult } from '@glimmer/interfaces';
import { UpdatableReference } from '@glimmer/reference';

export default class NativeComponentResult {
    name: string;
    result: RenderResult;
    state: UpdatableReference<{}>;
    runtime: AotRuntimeContext;

    constructor(name: string, result: RenderResult, state: UpdatableReference<{}>, runtime: AotRuntimeContext) {
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
