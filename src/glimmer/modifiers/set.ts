import { Dict } from '@glimmer/interfaces';

export default class setModifier<NativeModifierInstance> {
    public element;
    public property;
    public value;
    didInsertElement(element, _params: unknown[], _hash: Dict<unknown>) {
        const property: any = _params[0];
        const value = _params[1];
        element._nativeView[property] = value;
        // this.element = element;

        // console.log(`Modifier Did Insert Element: ${_params}`);
        // this.addEventListener(..._params);
    }
    // didUpdate(element, _params: unknown[], _hash: Dict<unknown>) {
    //     element.removeEventListener(_params[0], _params[1]);
    //     console.log(`Modifier Did Update Element: ${_params}`);
    // }
    // willDestroyElement() {
    //     this.element.removeEventListeners(this.eventName, this.callback);
    //     console.log(`Modifier Will Destroy Element`);
    // }
}
