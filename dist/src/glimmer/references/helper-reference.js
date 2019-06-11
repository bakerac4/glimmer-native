import { CachedReference } from '@glimmer/component';
export default function buildUserHelper(helperFunc) {
    return (args) => new HelperReference(helperFunc, args);
}
export class HelperReference extends CachedReference {
    constructor(helper, args) {
        super();
        this.helper = helper;
        this.tag = args.tag;
        this.args = args.capture();
    }
    compute() {
        let { helper, args } = this;
        return helper(args.positional.value(), args.named.value());
    }
}
