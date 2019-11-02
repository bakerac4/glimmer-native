import { precompile } from '@glimmer/compiler';

export default precompile(
    `<listview
        ...attributes
        {{set 'itemTemplateSelector' @itemTemplateSelector}}
        {{set 'items' @items}}
    >

        {{yield this}}
    </listview>`
);
