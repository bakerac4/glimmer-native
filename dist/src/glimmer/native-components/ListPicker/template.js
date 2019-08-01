import { precompile } from '@glimmer/compiler';
export default precompile(`<ListPicker ...attributes items={{@items}} selectedIndex={{@selectedIndex}} />`);
