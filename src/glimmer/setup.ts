import { precompile } from '@glimmer/compiler';

import LinkTo from './components/link-to/component';
import ListView from './components/list-view/component';
import { ResolverDelegate } from './context';
import buildAction from './helpers/action';
import onModifier from './modifiers/on';
import setModifier from './modifiers/set';
import NativeCapabilities from './native-capabilities';
import Resolver from './resolver';

// const precompile = require('@glimmer/compiler').precompile;

export default function setupGlimmer(resolverDelegate: ResolverDelegate, resolver: Resolver) {
    const actionHandle = resolver.registerHelper(buildAction);
    const onModifierHandle = resolver.registerModifier(onModifier);
    const setModifierHandle = resolver.registerModifier(setModifier);
    const linkToHandle = resolver.registerComponent('LinkTo', LinkTo);
    const listViewHandle = resolver.registerComponent('ListView', ListView);
    resolverDelegate.registerHelper('action', actionHandle);
    resolverDelegate.registerModifier('on', onModifierHandle);
    resolverDelegate.registerModifier('set', setModifierHandle);
    // const LinkToTemplate = readFileSync('./components/link-to/template.hbs');
    resolverDelegate.registerComponent(
        'LinkTo',
        linkToHandle,
        precompile(`<button text={{@text}} class="btn link-to" {{on "tap" (action this.onClick)}}></button>`),
        NativeCapabilities
    );
    resolverDelegate.registerComponent(
        'ListView',
        listViewHandle,
        precompile(`<listview ...attributes {{set 'items' @items}}></listview>`),
        NativeCapabilities
    );
}
