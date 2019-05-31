import Component from '@glimmer/component';
import { navigate } from '../../navigation';
export default class LinkTo extends Component {
    onClick() {
        const target = this.__owner__.args.target;
        navigate(target);
    }
}
