export default class onModifier {
    didInsertElement(element, _params, _hash) {
        element.addEventListener(_params[0], _params[1]);
        this.element = element;
        this.eventName = _params[0];
        this.callback = _params[1];
        // console.log(`Modifier Did Insert Element: ${_params}`);
        // this.addEventListener(..._params);
    }
    didUpdate(element, _params, _hash) {
        element.removeEventListener(_params[0], _params[1]);
        // console.log(`Modifier Did Update Element: ${_params}`);
    }
    willDestroyElement(element) {
        // element.removeEventListeners(this.eventName, this.callback);
        // console.log(`Modifier Will Destroy Element`);
    }
}
