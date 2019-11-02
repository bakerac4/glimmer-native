import { Dict } from '@glimmer/interfaces';
export default class setargsModifier<NativeModifierInstance> {
    element: any;
    property: any;
    value: any;
    didInsertElement(element: any, _params: unknown[], _hash: Dict<unknown>): void;
    didUpdate(element: any, _params: unknown[], _hash: Dict<unknown>): void;
}
