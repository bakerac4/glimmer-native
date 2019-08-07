# Glimmer-Native

Have you ever wanted to use Ember/Glimmer to create a native mobile app? Well now you can!
Keep in mind Glimmer Native is currently in an **ALPHA** state. **Use in production at your own risk**

Places this borrows code/concepts from:
[Svelte](https://github.com/halfnelson/svelte-native),
[Vue](https://github.com/nativescript-vue/nativescript-vue),
[Glimmer Embedding Tutorial](https://github.com/glimmerjs/glimmer-embedding-tutorial),
[Nativescript Demo](https://github.com/chadhietala/glimmer-native-demo)

## How to create your first Glimmer-Native project

1. Follow the [NativeScript Setup Guides](https://docs.nativescript.org/angular/start/quick-setup)
2. Run `ember new hello-glimmer-native -b glimmer-native-blueprint` in the command line
3. Run `tns run ios --bundle` (or to debug `tns debug ios --bundle --debug-brk`)

## How to use Glimmer-Native

There is a default set of Glimmer Components available to you that render native elements

-   [AbsoluteLayout](https://docs.nativescript.org/angular/ui/layouts/layout-containers#absolutelayout)
-   [ActionBar](https://docs.nativescript.org/angular/ui/ng-ui-widgets/action-bar)
-   [ActionItem](https://docs.nativescript.org/angular/ui/ng-ui-widgets/action-bar#action-items)
-   [ActivityIndicator](https://docs.nativescript.org/angular/ui/ng-ui-widgets/activity-indicator)
-   Border
-   Comment
-   [Button](https://docs.nativescript.org/angular/ui/ng-ui-widgets/button)
-   [DatePicker](https://docs.nativescript.org/angular/ui/ng-ui-widgets/date-picker)
-   [DockLayout](https://docs.nativescript.org/angular/ui/layouts/layout-containers#docklayout)
-   [FlexboxLayout](https://docs.nativescript.org/angular/ui/layouts/layout-containers#flexboxlayout)
-   FormattedString
-   [GridLayout](https://docs.nativescript.org/angular/ui/layouts/layout-containers#gridlayout)
-   [HtmlView](https://docs.nativescript.org/angular/ui/ng-ui-widgets/htmlview)
-   [Image](https://docs.nativescript.org/angular/ui/ng-ui-widgets/image)
-   [Label](https://docs.nativescript.org/angular/ui/ng-ui-widgets/label)
-   [ListPicker](https://docs.nativescript.org/angular/ui/ng-ui-widgets/listpicker)
-   [ListView](https://docs.nativescript.org/angular/ui/ng-ui-widgets/listview)
-   NavigationButton
-   Page
-   Span
-   [StackLayout](https://docs.nativescript.org/angular/ui/layouts/layout-containers#stacklayout)
-   [ScrollView](https://docs.nativescript.org/angular/ui/ng-ui-widgets/scroll-view)
-   [TabView](https://docs.nativescript.org/angular/ui/ng-ui-widgets/tab-view)
-   [TabViewItem](https://docs.nativescript.org/angular/ui/ng-ui-widgets/tab-view)
-   [TextField](https://docs.nativescript.org/angular/ui/ng-ui-widgets/text-field)
-   [TextView](https://docs.nativescript.org/angular/ui/ng-ui-widgets/text-view)
-   [Switch](https://docs.nativescript.org/angular/ui/ng-ui-widgets/switch)
-   [WebView](https://docs.nativescript.org/angular/ui/ng-ui-widgets/web-view)
-   [WrapLayout](https://docs.nativescript.org/angular/ui/layouts/layout-containers#wraplayout)

### Event handling

There is a built in `action` helper, along with a built in `on` modifier to allow for event handling

### Routing/Navigation

There is a `LinkTo` component provided that allows for navigation. You pass a `target` to it which tells GlimmerNative what component to render and navigate to. `<LinkTo @target="Dashboard" @text="Dashboard" @model={{this.model}} />` would create a component that listens for a click. Once clicked, Glimmer Native would look up the `Dashboard` Glimmer component, render it, and then navigate to it.

You MUST have the top level element be a `Page` component in order to navigate to it (so in the `Dashboard` component, the first element must be `Page`)

### Example

```hbs
<Page class="page">
    <ActionBar class="action-bar">
        <Label text={{this.title}} class="action-label" />
    </ActionBar>
    <TabView>
        <TabViewItem title="ToDo">
            <ScrollView>
                <StackLayout class="tasks">
                    {{#each tasks key="@index" |task|}}
                        <Task @task={{task}} />
                    {{/each}}
                </StackLayout>
            </ScrollView>
        </TabViewItem>
        <TabViewItem title="Calendar">
            <Button
                text={{this.buttonText}}
                class="btn"
                {{on "tap" (action buttonClick)}} />
            <Label text="Coming soon" />
        </TabViewItem>
    </TabView>
</Page>
```

and the component ts file:

```js
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class Task extends Component {
    @tracked
    public title = 'Welcome to glimmer';

    public buttonText = 'Click Me!';

    public buttonClick() {
        this.title = 'Tracked yo';
    }
}

```

## Known Issues

1. Need demo app
2. Need tests
3. Need documentation site

## Thanks to the following people for their help/guidance

-   [@chadhietala](https://github.com/chadhietala)
-   [@pzuraq](https://github.com/pzuraq)
-   [@acorncom](https://github.com/acorncom)

Sponsored in part by [Gavant Software](http://gavant.com)
