import { registerElement } from './element-registry';
import FrameElement from './native/FrameElement';
import ListViewElement from './native/ListViewElement';
import NativeElementNode from './native/NativeElementNode';
import PageElement from './native/PageElement';
import RadListViewElement from './native/RadListViewElement';
import TemplateElement from './native/TemplateElement';
import ElementNode from './nodes/ElementNode';
export function registerNativeElement(elementName, resolver, meta = null) {
    registerElement(elementName, () => new NativeElementNode(elementName, resolver(), meta));
}
// export function registerElement(elementName, resolver, meta = null) {
//     const normalizedName = normalizeElementName(elementName);
//     meta = Object.assign({}, defaultViewMeta, meta);
//     if (elementMap[normalizedName]) {
//         throw new Error(`Element for ${elementName} already registered.`);
//     }
//     const entry = {
//         resolver: resolver,
//         meta: meta
//     };
//     elementMap[normalizedName] = entry;
// }
export function registerElements() {
    registerElement('head', () => null, {
        insertChild(parentNode, childNode, atIndex) { }
    });
    // registerElement('Frame', () => require('tns-core-modules/ui/frame').Frame, {
    //     insertChild(parentNode, childNode, atIndex) {
    //         //dont bother
    //     }
    // });
    registerElement('div', () => require('tns-core-modules/ui/frame').Frame, {
        insertChild(parentNode, childNode, atIndex) {
            //dont bother
            parentNode.appendChild(childNode);
        }
    });
    // Completed
    registerNativeElement('AbsoluteLayout', () => require('tns-core-modules/ui/layouts/absolute-layout').AbsoluteLayout);
    registerNativeElement('ActionBar', () => require('tns-core-modules/ui/action-bar').ActionBar);
    registerNativeElement('ActionItem', () => require('tns-core-modules/ui/action-bar').ActionItem);
    registerNativeElement('ActivityIndicator', () => require('tns-core-modules/ui/activity-indicator').ActivityIndicator);
    registerNativeElement('Border', () => require('tns-core-modules/ui/border').Border);
    registerNativeElement('Comment', () => require('tns-core-modules/ui/placeholder').Placeholder);
    registerNativeElement('Button', () => require('tns-core-modules/ui/button').Button);
    registerNativeElement('DatePicker', () => require('tns-core-modules/ui/date-picker').DatePicker);
    registerNativeElement('DockLayout', () => require('tns-core-modules/ui/layouts/dock-layout').DockLayout);
    registerNativeElement('FlexboxLayout', () => require('tns-core-modules/ui/layouts/flexbox-layout').FlexboxLayout);
    registerNativeElement('FormattedString', () => require('tns-core-modules/text/formatted-string').FormattedString, {
        insertChild(parentNode, childNode, atIndex) {
            const parent = parentNode.nativeView;
            const child = childNode.nativeView;
            parent.spans.splice(atIndex, 0, child);
        }
    });
    registerNativeElement('GridLayout', () => require('tns-core-modules/ui/layouts/grid-layout').GridLayout);
    registerNativeElement('HtmlView', () => require('tns-core-modules/ui/html-view').HtmlView);
    registerNativeElement('Image', () => require('tns-core-modules/ui/image').Image);
    registerNativeElement('Label', () => require('tns-core-modules/ui/label').Label);
    registerNativeElement('ListPicker', () => require('tns-core-modules/ui/list-picker').ListPicker);
    registerNativeElement('NavigationButton', () => require('tns-core-modules/ui/action-bar').NavigationButton);
    // registerNativeElement('Page', () => require('tns-core-modules/ui/page').Page);
    registerNativeElement('Span', () => require('tns-core-modules/text/span').Span);
    registerNativeElement('StackLayout', () => require('tns-core-modules/ui/layouts/stack-layout').StackLayout);
    registerNativeElement('ScrollView', () => require('tns-core-modules/ui/scroll-view').ScrollView);
    registerNativeElement('Switch', () => require('tns-core-modules/ui/switch').Switch);
    registerNativeElement('TabContentItem', () => require('tns-core-modules/ui/tab-navigation-base/tab-content-item').TabContentItem);
    registerNativeElement('Tabs', () => require('tns-core-modules/ui/tabs').Tabs);
    registerNativeElement('TabStrip', () => require('tns-core-modules/ui/tab-navigation-base/tab-strip').TabStrip);
    registerNativeElement('TabStripItem', () => require('tns-core-modules/ui/tab-navigation-base/tab-strip-item').TabStripItem);
    registerNativeElement('TabView', () => require('tns-core-modules/ui/tab-view').TabView);
    registerNativeElement('TabViewItem', () => require('tns-core-modules/ui/tab-view').TabViewItem);
    registerNativeElement('TextField', () => require('tns-core-modules/ui/text-field').TextField);
    registerNativeElement('TextView', () => require('tns-core-modules/ui/text-view').TextView);
    registerNativeElement('WebView', () => require('tns-core-modules/ui/web-view').WebView);
    registerNativeElement('WrapLayout', () => require('tns-core-modules/ui/layouts/wrap-layout').WrapLayout);
    // Not Complete
    registerElement('ListView', () => new ListViewElement());
    registerElement('RadListView', () => new RadListViewElement());
    registerElement('Template', () => new TemplateElement());
    registerElement('Frame', () => new FrameElement());
    registerElement('Page', () => new PageElement());
    registerElement('Fragment', () => new ElementNode('fragment'));
}
