import { precompile } from '@glimmer/compiler';

export default precompile(`<webView ...attributes>{{yield}}</webView>`);
