import { precompile } from '@glimmer/compiler';

export default precompile(`<gridLayout ...attributes>{{yield}}</gridLayout>`);
