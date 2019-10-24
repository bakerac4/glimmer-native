import { precompile } from '@glimmer/compiler';
export default precompile(`<listview
        ...attributes
        {{set 'items' @items}}
        {{set 'itemTemplateSelector' @itemTemplateSelector}}
        {{set 'itemTemplates' this.keyedTemplates}}
        {{set 'template' @template false}}
    >

        {{yield this}}
    </listview>`);
