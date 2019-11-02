import { registerElement } from './element-registry';
import DivElement from './glimmer/DivElement';
import HeadElement from './glimmer/HeadElement';

// Dom elements that svelte expects to be able to create or use.
// or custom additions to make life easier

export function registerGlimmerElements() {
    registerElement('head', () => new HeadElement());
    registerElement('div', () => new DivElement());
}
