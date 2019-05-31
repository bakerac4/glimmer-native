import { precompile } from '@glimmer/compiler';

export default precompile(`
<button text={{@text}} class="btn link-to" {{on 'tap' (action this.onClick)}}></button>
`);
