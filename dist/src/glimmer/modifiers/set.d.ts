import { Dict } from '@glimmer/interfaces';
export default class setModifier<NativeModifierInstance> {
    element: any;
    property: any;
    value: any;
    didInsertElement(element: any, _params: unknown[], _hash: Dict<unknown>): void;
    didUpdate(element: any, _params: unknown[], _hash: Dict<unknown>): void;
}
