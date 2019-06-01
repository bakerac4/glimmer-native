import { precompile } from '@glimmer/compiler';

export default precompile(`<textView ...attributes>{{yield}}</textView>`);
