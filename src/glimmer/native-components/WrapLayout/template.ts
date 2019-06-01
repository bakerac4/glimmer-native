import { precompile } from '@glimmer/compiler';

export default precompile(`<wrapLayout ...attributes>{{yield}}</wrapLayout>`);
