import { precompile } from '@glimmer/compiler';
import LinkTo from './components/link-to/component';
import buildAction from './helpers/action';
import onModifier from './modifiers/on';
import NativeCapabilities from './native-capabilities';
// const precompile = require('@glimmer/compiler').precompile;
export default function setupGlimmer(resolverDelegate, resolver) {
    const actionHandle = resolver.registerHelper(buildAction);
    const onModifierHandle = resolver.registerModifier(onModifier);
    const linkToHandle = resolver.registerComponent('LinkTo', LinkTo);
    resolverDelegate.registerHelper('action', actionHandle);
    resolverDelegate.registerModifier('on', onModifierHandle);
    // const LinkToTemplate = readFileSync('./components/link-to/template.hbs');
    resolverDelegate.registerComponent('LinkTo', linkToHandle, precompile(`<button text={{@text}} class="btn link-to" {{on "tap" (action this.onClick)}}></button>`), NativeCapabilities);
}
