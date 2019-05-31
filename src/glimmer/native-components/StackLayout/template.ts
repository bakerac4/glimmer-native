import { precompile } from '@glimmer/compiler';

export default precompile(`<stackLayout ...attributes>{{yield}}</stackLayout>`);
