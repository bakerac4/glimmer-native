import { precompile } from '@glimmer/compiler';

export default precompile(`<comment ...attributes>{{yield}}</comment>`);
