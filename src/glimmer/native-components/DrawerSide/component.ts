import Component from '@glimmer/component';

export default class DrawerSide extends Component {
    didInsertElement() {
        const args: any = this.args;
        args.rendered(this.bounds.firstNode);
    }
}
