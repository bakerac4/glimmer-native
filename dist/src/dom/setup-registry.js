// Largely taken from the Vue implimentation
import { registerElement } from './element-registry';
import ListView from './native/list-view';
export function registerElements() {
    registerElement('ListView', () => ListView);
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
    registerElement('Page', () => require('tns-core-modules/ui/page').Page);
    registerElement('StackLayout', () => require('tns-core-modules/ui/layouts/stack-layout').StackLayout);
    registerElement('Label', () => require('tns-core-modules/ui/label').Label);
    registerElement('ActionBar', () => require('tns-core-modules/ui/action-bar').ActionBar);
    registerElement('ActionItem', () => require('tns-core-modules/ui/action-bar').ActionItem);
    registerElement('GridLayout', () => require('tns-core-modules/ui/layouts/grid-layout').GridLayout);
    registerElement('ScrollView', () => require('tns-core-modules/ui/scroll-view').ScrollView);
    registerElement('NavigationButton', () => require('tns-core-modules/ui/action-bar').NavigationButton);
    registerElement('TabView', () => require('tns-core-modules/ui/tab-view').TabView);
    registerElement('TabViewItem', () => require('tns-core-modules/ui/tab-view').TabViewItem);
    registerElement('DatePicker', () => require('tns-core-modules/ui/date-picker').DatePicker);
    registerElement('AbsoluteLayout', () => require('tns-core-modules/ui/layouts/absolute-layout').AbsoluteLayout);
    registerElement('ActivityIndicator', () => require('tns-core-modules/ui/activity-indicator').ActivityIndicator);
    registerElement('Border', () => require('tns-core-modules/ui/border').Border);
    registerElement('Button', () => require('tns-core-modules/ui/button').Button);
    registerElement('WebView', () => require('tns-core-modules/ui/web-view').WebView);
    registerElement('WrapLayout', () => require('tns-core-modules/ui/layouts/wrap-layout').WrapLayout);
    registerElement('FormattedString', () => require('tns-core-modules/text/formatted-string').FormattedString);
    registerElement('Span', () => require('tns-core-modules/text/span').Span);
    registerElement('TextView', () => require('tns-core-modules/ui/text-view').TextView);
    registerElement('p', () => require('tns-core-modules/ui/text-view').TextView);
    registerElement('Comment', () => require('tns-core-modules/ui/placeholder').Placeholder);
    // registerElement('Frame', () => new FrameElement())
    // registerElement('Page', () => new PageElement())
}
