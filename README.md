# Nativescript-Glimmer

This repo provides the ability to use glimmer VM in nativescript.

Places this borrows code/concepts from:
[Svelte](https://github.com/halfnelson/svelte-native),
[Vue](https://github.com/nativescript-vue/nativescript-vue),
[Glimmer Embedding Turorial](https://github.com/glimmerjs/glimmer-embedding-tutorial),
[Nativescript Demo](https://github.com/chadhietala/glimmer-native-demo)

A huge thanks to [@chadhietala](https://github.com/chadhietala) for answering my questions and providing me guidance.



## How to setup Nativescript-Glimmer

1. Follow the [NativeScript Setup Guides](https://docs.nativescript.org/angular/start/quick-setup)
2. Run `ember new PROJECT_NAME -b @glimmer/blueprint` in the command line
3. Run `ember install nativescript-glimmer-template`
4. Add `"nativescript-dev-webpack": "^0.20.2"` to your dev dependencies and run `npm install`
5. Run `tns run ios --bundle`


## How to use Nativescript-Glimmer
Take a look at the [available nativescript elements](https://github.com/bakerac4/nativescript-glimmer/blob/master/lib/dom/setup-registry.ts)
These are the elements you can use (not all of them have been tested yet)

There is a build in `action` helper, along with a built in `on` modifier to allow for event handling. 

Here is an example hbs file:
```
<button {{on "tap" (action next)}} text={{this.buttonText}} class="btn" />
```
and the component ts file:
```
import Component from '@glimmer/component';
export default class PageOne extends Component {
    buttonText = "Click Me!";

    next() {
        this.title = "I have been clicked";
    }
}
```

## Known Issues
1. [Tracked properties don't work](https://github.com/bakerac4/nativescript-glimmer/issues/3)
2. [Navigation not implemented](https://github.com/bakerac4/nativescript-glimmer/issues/4)
3. [No demo app](https://github.com/bakerac4/nativescript-glimmer/issues/5)
4. General Cleanup - most of the code needs to be cleaned up and improved upon
