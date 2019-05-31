import { precompile } from '@glimmer/compiler';
export default precompile(`<StackLayout class="template">{{yield this.item}}</StackLayout>
    <listview
        ...attributes
        {{set 'yieldItem' this.yieldItem false}}
        {{set 'template' this.bounds.firstNode false}}
        {{set 'items' @items}}
    /> `);
