import { precompile } from '@glimmer/compiler';
import { strip } from '@glimmer/util';

export default precompile(strip`
<page ...attributes>
    <stackLayout class="glimmer-templates">
        {{#each @listViewItems key="@index" as |item|}}
            {{#in-element item.node}}
                <HomeFeedPhotoItem @item={{item.item}} />
            {{/in-element}}
        {{/each}}
    </stackLayout>
    {{yield}}
</page>`);
