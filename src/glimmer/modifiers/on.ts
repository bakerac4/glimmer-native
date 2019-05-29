import { Dict } from '@glimmer/interfaces';

export default class onModifier<NativeModifierInstance>{
    public element;
    public eventName;
    public callback;
    didInsertElement(element, _params: unknown[], _hash: Dict<unknown>){
        element.addEventListener(_params[0], _params[1]);
        this.element = element;
        this.eventName = _params[0];
        this.callback = _params[1];
        console.log(`Modifier Did Insert Element: ${_params}`);
        // this.addEventListener(..._params);
    }
    didUpdate(element, _params: unknown[], _hash: Dict<unknown>){
        element.removeEventListener(_params[0], _params[1]);
        console.log(`Modifier Did Update Element: ${_params}`);
    }
    willDestroyElement(){
        this.element.removeEventListeners(this.eventName, this.callback);
        console.log(`Modifier Will Destroy Element`);
    }
}
