import { precompile } from '@glimmer/compiler';
import { strip } from '@glimmer/util';

export default precompile(strip`<radListView
    ...attributes
    {{set 'itemTemplateSelector' @itemTemplateSelector}}
    {{set 'items' @items}}
>
    {{yield this}}
</radListView>`);
