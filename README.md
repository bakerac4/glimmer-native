# Glimmer-Native

Have you ever wanted to use Ember/Glimmer to create a native mobile app? Well now you can! 

Places this borrows code/concepts from:
[Svelte](https://github.com/halfnelson/svelte-native),
[Vue](https://github.com/nativescript-vue/nativescript-vue),
[Glimmer Embedding Tutorial](https://github.com/glimmerjs/glimmer-embedding-tutorial),
[Nativescript Demo](https://github.com/chadhietala/glimmer-native-demo)

## How to create your first Glimmer-Native project

1. Follow the [NativeScript Setup Guides](https://docs.nativescript.org/angular/start/quick-setup)
2. Run `ember new hello-glimmer-native -b glimmer-native-blueprint` in the command line
    - Occasionally the blueprint hangs on the first run. A bug has been created [here](https://github.com/bakerac4/glimmer-native-blueprint/issues/1). If this happens to you, just kill the process and run it again. It will work the 2nd time.
3. Run `tns run ios --bundle` (or to debug `tns debug ios --bundle --debug-brk`)


## How to use Glimmer-Native
There is a default set of Glimmer Components available to you that render native elements. Most if not all of these should be working, but there might be a straggler or two I missed.
- AbsoluteLayout
- ActionBar
- ActionItem
- ActivityIndicator
- Border
- Comment
- Button
- DatePicker
- DockLayout
- FlexboxLayout
- FormattedString
- GridLayout
- Image
- Label
- NavigationButton
- Page
- Span
- StackLayout
- ScrollView
- TabView
- TabViewItem
- TextView
- WebView
- WrapLayout

### Event handling
There is a built in `action` helper, along with a built in `on` modifier to allow for event handling

### Routing/Navigation
There is a `LinkTo` component provided that allows for navigation. You pass a `target` to it which tells GlimmerNative what component to render and navigate to. `<LinkTo @target="Dashboard" @text="Dashboard" />` would create a component that listens for a click. Once clicked, Glimmer Native would look up the `Dashboard` Glimmer component, render it, and then navigate to it.

You MUST have the top level element be a `Page` component in order to navigate to it (so in the `Dashboard` component, the first element must be `Page`)

### Example
```
<Page class="page">
    <ActionBar class="action-bar">
        <Label text={{this.title}} class="action-label" />
    </ActionBar>
    <TabView>
        <TabViewItem title="ToDo">
            <ScrollView>
                <StackLayout class="tasks">
                    {{#each tasks as |task|}}
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
```
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
2. List View not working yet (for now you can still use `#each`)
3. Need ability to add plugins on the fly


## Thanks to the following people for their help/guidance
- [@chadhietala](https://github.com/chadhietala)
- [@pzuraq](https://github.com/pzuraq)
- [@acorncom](https://github.com/acorncom)

Sponsored in part by [Gavant Software](http://gavant.com)
