import { precompile } from '@glimmer/compiler';
import { strip } from '@glimmer/util';

export default precompile(strip`
<page ...attributes>
    {{yield}}
</page>`);
