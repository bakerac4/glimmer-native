import { precompile } from '@glimmer/compiler';

export default precompile(
    `<listview
        ...attributes
        {{set 'items' @items}}>
        {{yield this}}
    </listview>`
);
