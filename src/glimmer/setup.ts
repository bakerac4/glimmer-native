import LinkTo from './components/LinkTo/component';
import LinkToTemplate from './components/LinkTo/template';
import { ResolverDelegate } from './context';
import buildAction from './helpers/action';
import hash from './helpers/hash';
import ifHelper from './helpers/if';
import onModifier from './modifiers/on';
import setModifier from './modifiers/set';
import NativeCapabilities from './native-capabilities';
import AbsoluteLayout from './native-components/AbsoluteLayout/component';
import AbsoluteLayoutTemplate from './native-components/AbsoluteLayout/template';
import ActionBar from './native-components/ActionBar/component';
import ActionBarTemplate from './native-components/ActionBar/template';
import ActionItem from './native-components/ActionItem/component';
import ActionItemTemplate from './native-components/ActionItem/template';
import ActivityIndicator from './native-components/ActivityIndicator/component';
import ActivityIndicatorTemplate from './native-components/ActivityIndicator/template';
import Border from './native-components/Border/component';
import BorderTemplate from './native-components/Border/template';
import Button from './native-components/Button/component';
import ButtonTemplate from './native-components/Button/template';
import Comment from './native-components/Comment/component';
import CommentTemplate from './native-components/Comment/template';
import DatePicker from './native-components/DatePicker/component';
import DatePickerTemplate from './native-components/DatePicker/template';
import DockLayout from './native-components/DockLayout/component';
import DockLayoutTemplate from './native-components/DockLayout/template';
import DrawerMain from './native-components/DrawerMain/component';
import DrawerMainTemplate from './native-components/DrawerMain/template';
import DrawerSide from './native-components/DrawerSide/component';
import DrawerSideTemplate from './native-components/DrawerSide/template';
import FlexboxLayout from './native-components/FlexboxLayout/component';
import FlexboxLayoutTemplate from './native-components/FlexboxLayout/template';
import FormattedString from './native-components/FormattedString/component';
import FormattedStringTemplate from './native-components/FormattedString/template';
import GridLayout from './native-components/GridLayout/component';
import GridLayoutTemplate from './native-components/GridLayout/template';
import Image from './native-components/Image/component';
import ImageTemplate from './native-components/Image/template';
import Label from './native-components/Label/component';
import LabelTemplate from './native-components/Label/template';
import ListView from './native-components/ListView/component';
import ListViewTemplate from './native-components/ListView/template';
import NavigationButton from './native-components/NavigationButton/component';
import NavigationButtonTemplate from './native-components/NavigationButton/template';
import Page from './native-components/Page/component';
import PageTemplate from './native-components/Page/template';
import RadSideDrawer from './native-components/RadSideDrawer/component';
import RadSideDrawerTemplate from './native-components/RadSideDrawer/template';
import ScrollView from './native-components/ScrollView/component';
import ScrollViewTemplate from './native-components/ScrollView/template';
import Span from './native-components/Span/component';
import SpanTemplate from './native-components/Span/template';
import StackLayout from './native-components/StackLayout/component';
import StackLayoutTemplate from './native-components/StackLayout/template';
import TabView from './native-components/TabView/component';
import TabViewTemplate from './native-components/TabView/template';
import TabViewItem from './native-components/TabViewItem/component';
import TabViewItemTemplate from './native-components/TabViewItem/template';
import TextView from './native-components/TextView/component';
import TextViewTemplate from './native-components/TextView/template';
import WebView from './native-components/WebView/component';
import WebViewTemplate from './native-components/WebView/template';
import WrapLayout from './native-components/WrapLayout/component';
import WrapLayoutTemplate from './native-components/WrapLayout/template';
import buildUserHelper from './references/helper-reference';
import Resolver from './resolver';

// const precompile = require('@glimmer/compiler').precompile;

export default function setupGlimmer(resolverDelegate: ResolverDelegate, resolver: Resolver) {
    const actionHandle = resolver.registerHelper(buildAction);
    const hashHandle = resolver.registerHelper(hash);
    let glimmerIfHelper = buildUserHelper(ifHelper);
    // return this.register('helper', name, glimmerHelper);
    const ifHandle = resolver.registerHelper(glimmerIfHelper);
    const onModifierHandle = resolver.registerModifier(onModifier);
    const setModifierHandle = resolver.registerModifier(setModifier);
    const linkToHandle = resolver.registerComponent('LinkTo', LinkTo);
    resolverDelegate.registerHelper('action', actionHandle);
    resolverDelegate.registerHelper('hash', hashHandle);
    resolverDelegate.registerHelper('if', ifHandle);
    resolverDelegate.registerModifier('on', onModifierHandle);
    resolverDelegate.registerModifier('set', setModifierHandle);
    resolverDelegate.registerComponent('LinkTo', linkToHandle, LinkToTemplate, NativeCapabilities);

    registerNativeComponent(resolver, resolverDelegate, 'AbsoluteLayout', AbsoluteLayout, AbsoluteLayoutTemplate);
    registerNativeComponent(resolver, resolverDelegate, 'ActionBar', ActionBar, ActionBarTemplate);
    registerNativeComponent(resolver, resolverDelegate, 'ActionItem', ActionItem, ActionItemTemplate);
    registerNativeComponent(
        resolver,
        resolverDelegate,
        'ActivityIndicator',
        ActivityIndicator,
        ActivityIndicatorTemplate
    );
    registerNativeComponent(resolver, resolverDelegate, 'Border', Border, BorderTemplate);
    registerNativeComponent(resolver, resolverDelegate, 'Button', Button, ButtonTemplate);
    registerNativeComponent(resolver, resolverDelegate, 'Comment', Comment, CommentTemplate);
    registerNativeComponent(resolver, resolverDelegate, 'DatePicker', DatePicker, DatePickerTemplate);
    registerNativeComponent(resolver, resolverDelegate, 'DockLayout', DockLayout, DockLayoutTemplate);
    registerNativeComponent(resolver, resolverDelegate, 'DrawerSide', DrawerSide, DrawerSideTemplate);
    registerNativeComponent(resolver, resolverDelegate, 'DrawerMain', DrawerMain, DrawerMainTemplate);
    registerNativeComponent(resolver, resolverDelegate, 'FlexboxLayout', FlexboxLayout, FlexboxLayoutTemplate);
    registerNativeComponent(resolver, resolverDelegate, 'FormattedString', FormattedString, FormattedStringTemplate);
    registerNativeComponent(resolver, resolverDelegate, 'GridLayout', GridLayout, GridLayoutTemplate);
    registerNativeComponent(resolver, resolverDelegate, 'Image', Image, ImageTemplate);
    registerNativeComponent(resolver, resolverDelegate, 'Label', Label, LabelTemplate);
    registerNativeComponent(resolver, resolverDelegate, 'ListView', ListView, ListViewTemplate);
    registerNativeComponent(resolver, resolverDelegate, 'NavigationButton', NavigationButton, NavigationButtonTemplate);
    registerNativeComponent(resolver, resolverDelegate, 'Page', Page, PageTemplate);
    registerNativeComponent(resolver, resolverDelegate, 'RadSideDrawer', RadSideDrawer, RadSideDrawerTemplate);
    registerNativeComponent(resolver, resolverDelegate, 'Span', Span, SpanTemplate);
    registerNativeComponent(resolver, resolverDelegate, 'StackLayout', StackLayout, StackLayoutTemplate);
    registerNativeComponent(resolver, resolverDelegate, 'ScrollView', ScrollView, ScrollViewTemplate);
    registerNativeComponent(resolver, resolverDelegate, 'TabView', TabView, TabViewTemplate);
    registerNativeComponent(resolver, resolverDelegate, 'TabViewItem', TabViewItem, TabViewItemTemplate);
    registerNativeComponent(resolver, resolverDelegate, 'TextView', TextView, TextViewTemplate);
    registerNativeComponent(resolver, resolverDelegate, 'WebView', WebView, WebViewTemplate);
    registerNativeComponent(resolver, resolverDelegate, 'WrapLayout', WrapLayout, WrapLayoutTemplate);
}

function registerNativeComponent(resolver, delegate, name, component, template) {
    const handle = resolver.registerComponent(name, component);
    delegate.registerComponent(name, handle, template, NativeCapabilities);
}
