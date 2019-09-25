import { precompile } from '@glimmer/compiler';

export default precompile(`<tabStripItem ...attributes>{{yield}}</tabStripItem>`);
