import { CachedReference } from '@glimmer/component';
import { Dict, Helper as GlimmerHelper, VMArguments } from '@glimmer/interfaces';
export declare type UserHelper = (args: ReadonlyArray<unknown>, named: Dict<unknown>) => any;
export default function buildUserHelper(helperFunc: UserHelper): GlimmerHelper;
export declare class HelperReference extends CachedReference<unknown> {
    private helper;
    tag: any;
    private args;
    constructor(helper: UserHelper, args: VMArguments);
    compute(): any;
}
