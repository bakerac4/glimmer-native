import { precompile } from '@glimmer/compiler';

export default precompile(`<tabs ...attributes>{{yield}}</tabs>`);
