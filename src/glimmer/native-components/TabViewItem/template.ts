import { precompile } from '@glimmer/compiler';

export default precompile(`<tabViewItem ...attributes>{{yield}}</tabViewItem>`);
