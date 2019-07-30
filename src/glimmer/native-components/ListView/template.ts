import { precompile } from '@glimmer/compiler';

export default precompile(
    `<listview
        ...attributes
        {{set 'items' @items}}
        {{set 'template' @template false}}
    >

        {{yield this}}
    </listview>`
);
