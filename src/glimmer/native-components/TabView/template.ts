import { precompile } from '@glimmer/compiler';

export default precompile(`<tabView ...attributes>{{yield}}</tabView>`);
