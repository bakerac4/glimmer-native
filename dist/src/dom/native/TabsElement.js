import { Tabs } from 'tns-core-modules/ui/tabs';
import BaseTabNavigationElement from './BaseTabNavigationElement';
export default class TabsElement extends BaseTabNavigationElement {
    constructor() {
        super('Tabs', Tabs);
    }
}
