import { precompile } from '@glimmer/compiler';
export default precompile(`<htmlView ...attributes>{{yield}}</htmlView>`);
