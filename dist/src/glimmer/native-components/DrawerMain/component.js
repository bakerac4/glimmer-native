import Component from '@glimmer/component';
export default class DrawerMain extends Component {
    didInsertElement() {
        const parentNativeView = this.element.parentElement._nativeView;
        parentNativeView.mainContent = this.element._nativeView;
    }
}
