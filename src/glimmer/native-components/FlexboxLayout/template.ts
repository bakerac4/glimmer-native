import { precompile } from '@glimmer/compiler';

export default precompile(`<flexboxLayout ...attributes>{{yield}}</flexboxLayout>`);
