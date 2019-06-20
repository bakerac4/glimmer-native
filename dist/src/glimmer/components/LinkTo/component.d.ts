import Component from '@glimmer/component';
import { NavigationTransition } from 'tns-core-modules/ui/frame/frame';
export default class LinkTo extends Component {
    frame?: any;
    context?: any;
    animated?: boolean;
    backstackVisible?: boolean;
    clearHistory?: boolean;
    transition?: NavigationTransition;
    transitionAndroid?: NavigationTransition;
    transitioniOS?: NavigationTransition;
    component: string;
    model: any;
    __owner__: any;
    onClick(): void;
}
