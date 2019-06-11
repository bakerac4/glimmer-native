import { CachedReference } from '@glimmer/component';
import { CapturedArguments, Dict, Helper as GlimmerHelper, VMArguments } from '@glimmer/interfaces';

export type UserHelper = (args: ReadonlyArray<unknown>, named: Dict<unknown>) => any;

export default function buildUserHelper(helperFunc: UserHelper): GlimmerHelper {
    return (args) => new HelperReference(helperFunc, args) as any;
}

export class HelperReference extends CachedReference<unknown> {
    public tag: any;
    private args: CapturedArguments;

    constructor(private helper: UserHelper, args: VMArguments) {
        super();

        this.tag = args.tag;
        this.args = args.capture();
    }

    compute() {
        let { helper, args } = this;

        return helper(args.positional.value(), args.named.value());
    }
}
