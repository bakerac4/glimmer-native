import { precompile } from '@glimmer/compiler';
import { strip } from '@glimmer/util';
export default precompile(strip `<radListView
    ...attributes
    {{set '_loadOnDemandItemTemplate' @loadOnDemandItemTemplate true}}
    {{set 'itemTemplateSelector' @itemTemplateSelector}}
    {{set 'groupingFunction' @groupingFunction}}
    {{set 'sortingFunction' @sortingFunction}}
    {{set 'items' @items}}
>
    {{yield this}}
</radListView>`);
