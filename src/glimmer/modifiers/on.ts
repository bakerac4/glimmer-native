import { Dict } from '@glimmer/interfaces';

export default class onModifier<NativeModifierInstance> {
    public element;
    public eventName;
    public callback;
    public params;

    didInsertElement(element, _params: unknown[], _hash: Dict<unknown>) {
        this.eventName = _params[0];
        this.callback = _params[1];
        this.params = _params[2];

        if (this.params) {
            const params = Array.isArray(this.params) ? this.params : [this.params];
            const _callback = this.callback;
            this.callback = (...args) => {
                return _callback.call(this, ...params, ...args);
            };
        }
        element.addEventListener(this.eventName, this.callback);

        // console.log(`Modifier Did Insert Element: ${_params}`);
        // this.addEventListener(..._params);
    }
    didUpdate(element, _params: unknown[], _hash: Dict<unknown>) {
        this.eventName = _params[0];
        this.callback = _params[1];

        element.removeEventListener(this.eventName, this.callback);
        // console.log(`Modifier Did Update Element: ${_params}`);
    }
    willDestroyElement(element) {
        // element.removeEventListeners(this.eventName, this.callback);
        // console.log(`Modifier Will Destroy Element`);
    }
}
