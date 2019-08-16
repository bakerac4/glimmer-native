import { Dict } from '@glimmer/interfaces';

export default class setargsModifier<NativeModifierInstance> {
    public element;
    public property;
    public value;
    didInsertElement(element, _params: unknown[], _hash: Dict<unknown>) {
        const glimmerComponent: any = _params[0];
        const native = _params[1] !== false ? true : false;
        if (native) {
            Object.keys(glimmerComponent.args).forEach((key) => {
                const value = glimmerComponent.args[key];
                element._nativeView[key] = value;
            });
        } else {
            Object.keys(glimmerComponent.args).forEach((key) => {
                const value = glimmerComponent.args[key];
                element[key] = value;
            });
        }

        // this.element = element;

        // console.log(`Modifier Did Insert Element: ${_params}`);
        // this.addEventListener(..._params);
    }
    didUpdate(element, _params: unknown[], _hash: Dict<unknown>) {
        const glimmerComponent: any = _params[0];
        const native = _params[1] !== false ? true : false;
        if (native) {
            Object.keys(glimmerComponent.args).forEach((key) => {
                const value = glimmerComponent.args[key];
                element._nativeView[key] = value;
            });
        } else {
            Object.keys(glimmerComponent.args).forEach((key) => {
                const value = glimmerComponent.args[key];
                element[key] = value;
            });
        }
    }
    // willDestroyElement() {
    //     this.element.removeEventListeners(this.eventName, this.callback);
    //     console.log(`Modifier Will Destroy Element`);
    // }
}
