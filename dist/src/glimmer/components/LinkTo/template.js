import { precompile } from '@glimmer/compiler';
export default precompile(`
{{#if (has-block)}}
    <FlexboxLayout class="link-to" {{on 'tap' (action this.onClick)}}>
        {{yield}}
    </FlexboxLayout>
{{else}}
    <button text={{@text}} class="btn link-to" {{on 'tap' (action this.onClick)}}></button>
{{/if}}
`);
