import { AotRuntimeContext, RenderResult } from '@glimmer/interfaces';
import { UpdatableReference } from '@glimmer/reference';
export default class NativeComponentResult {
    name: string;
    result: RenderResult;
    state: UpdatableReference<{}>;
    runtime: AotRuntimeContext;
    constructor(name: string, result: RenderResult, state: UpdatableReference<{}>, runtime: AotRuntimeContext);
    update(state: any): void;
    toJSON(): {
        GlimmerDebug: string;
    };
}
