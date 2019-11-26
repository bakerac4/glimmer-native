export default class onModifier {
    didInsertElement(element, _params, _hash) {
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
    didUpdate(element, _params, _hash) {
        this.eventName = _params[0];
        this.callback = _params[1];
        element.removeEventListener(this.eventName, this.callback);
        // console.log(`Modifier Did Update Element: ${_params}`);
    }
}
