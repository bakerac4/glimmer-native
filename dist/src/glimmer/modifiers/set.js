export default class setModifier {
    didInsertElement(element, _params, _hash) {
        const property = _params[0];
        const value = _params[1];
        const native = _params[2] !== false ? true : false;
        if (native) {
            element._nativeView[property] = value;
        }
        else {
            element[property] = value;
        }
        // this.element = element;
        // console.log(`Modifier Did Insert Element: ${_params}`);
        // this.addEventListener(..._params);
    }
    didUpdate(element, _params, _hash) {
        const property = _params[0];
        const value = _params[1];
        const native = _params[2] !== false ? true : false;
        if (native) {
            element._nativeView[property] = value;
        }
        else {
            element[property] = value;
        }
        console.log(`Modifier Did Update Element: ${_params}`);
    }
}
