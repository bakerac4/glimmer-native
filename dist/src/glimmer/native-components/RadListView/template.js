import { precompile } from '@glimmer/compiler';
export default precompile(`<radListView
        ...attributes
        {{set 'items' @items}}
        {{set 'itemTemplateSelector' @itemTemplateSelector}}
        {{set 'itemTemplates' this.keyedTemplates}}
    >

        {{yield this}}
    </radListView>`);
