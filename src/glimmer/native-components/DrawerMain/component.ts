import Component from '@glimmer/component';

export default class DrawerMain extends Component {
    didInsertElement() {
        const parentNativeView = (this.element.parentElement as any)._nativeView;
        parentNativeView.mainContent = (this.element as any)._nativeView;
    }
}
