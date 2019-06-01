import Component from '@glimmer/component';
export default class DrawerSide extends Component {
    didInsertElement() {
        const parentNativeView = this.element.parentElement._nativeView;
        parentNativeView.drawerContent = this.element._nativeView;
    }
}
