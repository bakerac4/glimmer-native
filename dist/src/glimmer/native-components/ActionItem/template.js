import { precompile } from '@glimmer/compiler';
export default precompile(`<actionItem ...attributes>{{yield this.bounds.firstNode}}</actionItem>`);
