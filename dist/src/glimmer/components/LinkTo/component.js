import Component from '@glimmer/component';
import { navigate, showModal } from '../../navigation';
export default class LinkTo extends Component {
    onClick() {
        const args = this.__owner__.args;
        const target = args.component;
        if (args.modal) {
            const options = {
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
            if (args.model) {
                options.context = {
                    model: args.model
                };
            }
            navigate(target, options);
        }
    }
}
