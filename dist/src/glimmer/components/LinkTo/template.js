import { precompile } from '@glimmer/compiler';
export default precompile(`
{{#if (has-block)}}
    <FlexboxLayout ...attributes class="link-to" {{on 'tap' (action this.onClick)}}>
        {{yield}}
    </FlexboxLayout>
{{else}}
    <button ...attributes text={{@text}} class="btn link-to" {{on 'tap' (action this.onClick)}}></button>
{{/if}}
`);
