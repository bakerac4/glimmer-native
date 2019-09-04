import { precompile } from '@glimmer/compiler';
export default precompile(`<radListView
        ...attributes
        {{set 'items' @items}}
        {{set 'template' @template false}}
        {{set 'component' @component false}}
        {{on "loaded" this.loaded}}
    >

        {{yield this}}
    </radListView>`);
