export default class setargsModifier {
    didInsertElement(element, _params, _hash) {
        const glimmerComponent = _params[0];
        const native = _params[1] !== false ? true : false;
        if (native) {
            Object.keys(glimmerComponent.args).forEach((key) => {
                const value = glimmerComponent.args[key];
                element._nativeView[key] = value;
            });
        }
        else {
            Object.keys(glimmerComponent.args).forEach((key) => {
                const value = glimmerComponent.args[key];
                element[key] = value;
            });
        }
        // this.element = element;
        // console.log(`Modifier Did Insert Element: ${_params}`);
        // this.addEventListener(..._params);
    }
    didUpdate(element, _params, _hash) {
        const glimmerComponent = _params[0];
        const native = _params[1] !== false ? true : false;
        if (native) {
            Object.keys(glimmerComponent.args).forEach((key) => {
                const value = glimmerComponent.args[key];
                element._nativeView[key] = value;
            });
        }
        else {
            Object.keys(glimmerComponent.args).forEach((key) => {
                const value = glimmerComponent.args[key];
                element[key] = value;
            });
        }
    }
}
