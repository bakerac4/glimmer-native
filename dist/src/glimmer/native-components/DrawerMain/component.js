import Component from '@glimmer/component';
export default class DrawerMain extends Component {
    didInsertElement() {
        const args = this.args;
        args.rendered(this.bounds.firstNode);
    }
}
