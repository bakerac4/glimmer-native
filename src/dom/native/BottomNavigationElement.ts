import { BottomNavigation } from 'tns-core-modules/ui/bottom-navigation';

import BaseTabNavigationElement from './BaseTabNavigationElement';

export default class BottomNavigationElement extends BaseTabNavigationElement {
    constructor() {
        super('BottomNavigation', BottomNavigation);
    }
}
