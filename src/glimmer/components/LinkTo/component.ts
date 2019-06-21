import Component from '@glimmer/component';
import { NavigationTransition } from 'tns-core-modules/ui/frame/frame';

import { navigate, NavigationOptions, showModal, ShowModalOptions } from '../../navigation';

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
    onClick() {
        const args = this.args as any;
        const target = args.component;

        if (args.modal) {
            const options: ShowModalOptions = {
                android: args.android,
                ios: args.ios,
                animated: args.animated,
                fullscreen: args.fullscreen,
                stretched: args.stretched
            };
            if (args.model) {
                options.context = {
                    model: args.model
                };
            }
            showModal(target, options);
        } else {
            const options: NavigationOptions = {
                frame: args.frame,
                animated: args.animated,
                backstackVisible: args.backstackVisible,
                clearHistory: args.clearHistory,
                transition: args.transition,
                transitionAndroid: args.transitionAndroid,
                transitioniOS: args.transitioniOS
            };
            if (args.model) {
                options.context = {
                    model: args.model
                };
            }
            navigate(target, options);
        }
    }
}
