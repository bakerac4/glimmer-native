import { precompile } from '@glimmer/compiler';
export default precompile(`<page ...attributes><stackLayout class="glimmer-templates"></stackLayout> {{yield}}</page>`);
