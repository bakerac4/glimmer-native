import Component from '@glimmer/component';
export default class DrawerMain extends Component {
    didInsertElement() {
        const args = this.__owner__.args;
        args.rendered(this.bounds.firstNode);
    }
}
