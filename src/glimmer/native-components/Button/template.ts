import { precompile } from '@glimmer/compiler';

export default precompile(`<button ...attributes>{{yield}}</button>`);
