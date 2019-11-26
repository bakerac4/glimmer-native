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

    async update(state) {
        this.state.forceUpdate(state);
        this.runtime.env.begin();
        await this.result.rerender();
        this.runtime.env.commit();
    }

    destroy() {
        if (this.result) {
            this.result.destroy();
            this.result = null;
        }
    }

    toJSON() {
        return { GlimmerDebug: `<component-result name="${this.name}">` };
    }
}
