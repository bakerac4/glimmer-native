import Component from '@glimmer/component';
import { navigate, showModal } from '../../navigation';
export default class LinkTo extends Component {
    onClick() {
        const args = this.args;
        const target = args.component;
        if (args.modal) {
            const options = {
                android: args.android,
                ios: args.ios,
                animated: args.animated,
                fullscreen: args.fullscreen,
                stretched: args.stretched
            };
            showModal(target, args.model, options);
        }
        else {
            const options = {
                frame: args.frame,
                animated: args.animated,
                backstackVisible: args.backstackVisible,
                clearHistory: args.clearHistory,
                transition: args.transition,
                transitionAndroid: args.transitionAndroid,
                transitioniOS: args.transitioniOS
            };
            navigate(target, args.model, options);
        }
    }
}
