export default class setModifier {
    didInsertElement(element, _params, _hash) {
        const property = _params[0];
        const value = _params[1];
        element._nativeView[property] = value;
        // this.element = element;
        // console.log(`Modifier Did Insert Element: ${_params}`);
        // this.addEventListener(..._params);
    }
}
