// Largely taken from the Vue implimentation
import { registerElement } from './element-registry';
import ListView from './native/list-view';
import TemplateElement from './native/TemplateElement';
export function registerElements() {
    registerElement('head', () => null, {
        insertChild(parentNode, childNode, atIndex) { }
    });
    registerElement('Frame', () => require('tns-core-modules/ui/frame').Frame, {
        insertChild(parentNode, childNode, atIndex) {
            //dont bother
        }
    });
    registerElement('div', () => require('tns-core-modules/ui/frame').Frame, {
        insertChild(parentNode, childNode, atIndex) {
            //dont bother
            parentNode.appendChild(childNode);
        }
    });
    // Completed
    registerElement('AbsoluteLayout', () => require('tns-core-modules/ui/layouts/absolute-layout').AbsoluteLayout);
    registerElement('ActionBar', () => require('tns-core-modules/ui/action-bar').ActionBar);
    registerElement('ActionItem', () => require('tns-core-modules/ui/action-bar').ActionItem);
    registerElement('ActivityIndicator', () => require('tns-core-modules/ui/activity-indicator').ActivityIndicator);
    registerElement('Border', () => require('tns-core-modules/ui/border').Border);
    registerElement('Comment', () => require('tns-core-modules/ui/placeholder').Placeholder);
    registerElement('Button', () => require('tns-core-modules/ui/button').Button);
    registerElement('DatePicker', () => require('tns-core-modules/ui/date-picker').DatePicker);
    registerElement('DockLayout', () => require('tns-core-modules/ui/layouts/dock-layout').DockLayout);
    registerElement('FlexboxLayout', () => require('tns-core-modules/ui/layouts/flexbox-layout').FlexboxLayout);
    registerElement('FormattedString', () => require('tns-core-modules/text/formatted-string').FormattedString);
    registerElement('GridLayout', () => require('tns-core-modules/ui/layouts/grid-layout').GridLayout);
    registerElement('Image', () => require('tns-core-modules/ui/image').Image);
    registerElement('Label', () => require('tns-core-modules/ui/label').Label);
    registerElement('NavigationButton', () => require('tns-core-modules/ui/action-bar').NavigationButton);
    registerElement('Page', () => require('tns-core-modules/ui/page').Page);
    registerElement('Span', () => require('tns-core-modules/text/span').Span);
    registerElement('StackLayout', () => require('tns-core-modules/ui/layouts/stack-layout').StackLayout);
    registerElement('ScrollView', () => require('tns-core-modules/ui/scroll-view').ScrollView);
    registerElement('TabView', () => require('tns-core-modules/ui/tab-view').TabView);
    registerElement('TabViewItem', () => require('tns-core-modules/ui/tab-view').TabViewItem);
    registerElement('TextView', () => require('tns-core-modules/ui/text-view').TextView);
    registerElement('WebView', () => require('tns-core-modules/ui/web-view').WebView);
    registerElement('WrapLayout', () => require('tns-core-modules/ui/layouts/wrap-layout').WrapLayout);
    // Not Complete
    registerElement('ListView', () => ListView);
    registerElement('RadSideDrawer', () => require('nativescript-ui-sidedrawer').RadSideDrawer);
    registerElement('Template', () => new TemplateElement());
}
