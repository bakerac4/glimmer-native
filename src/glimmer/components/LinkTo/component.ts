import Component from '@glimmer/component';

import { navigate } from '../../navigation';

export default class LinkTo extends Component {
    target: string;
    __owner__: any;
    onClick() {
        const target = this.__owner__.args.target;
        navigate(target);
    }
}
