import Component from '@glimmer/component';

export default class DrawerSide extends Component {
    didInsertElement() {
        const parentNativeView = (this.element.parentElement as any)._nativeView;
        parentNativeView.drawerContent = (this.element as any)._nativeView;
    }
}
