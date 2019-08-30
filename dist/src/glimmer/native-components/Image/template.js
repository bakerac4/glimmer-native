import { precompile } from '@glimmer/compiler';
export default precompile(`<image ...attributes {{set 'src' @src true}}/>`);
