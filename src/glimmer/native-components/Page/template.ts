import { precompile } from '@glimmer/compiler';
import { strip } from '@glimmer/util';

export default precompile(strip`
<page ...attributes>
    {{#each @listViewItems key="@index" as |item|}}
        {{#in-element item.node}}
            <HomeFeedPhotoItem @item={{item.item}} />
        {{/in-element}}
    {{/each}}
    {{yield}}
</page>`);
