import Component from '@glimmer/component';

export default class DrawerMain extends Component {
    __owner__: any;
    didInsertElement() {
        const args: any = this.__owner__.args;
        args.rendered(this.bounds.firstNode);
    }
}
