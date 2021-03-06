The `<AbsoluteLayout>` container is the simplest layout container in NativeScript.

`<AbsoluteLayout>` has the following behavior:

-   Uses a pair of absolute left/top coordinates to position its children.
-   Doesn't enforce any layout constraints on its children.
-   Doesn't resize its children at runtime when its size changes.

### Examples {docsify-ignore}

#### A grid-like layout {docsify-ignore}

The following example creates a simple grid. For more information about creating grid layouts, see [GridLayout](/en/docs/elements/layouts/grid-layout).

```
<AbsoluteLayout backgroundColor="#3c495e">
    <Label text="10,10" left="10" top="10" width="100" height="100" backgroundColor="#43b883" />
    <Label text="120,10" left="120" top="10" width="100" height="100" backgroundColor="#43b883" />
    <Label text="10,120" left="10" top="120" width="100" height="100" backgroundColor="#43b883" />
    <Label text="120,120" left="120" top="120" width="100" height="100" backgroundColor="#43b883" />
</AbsoluteLayout>
```

<img class="md:w-1/2 lg:w-1/3" src="https://art.nativescript-vue.org/layouts/absolute_layout_grid.svg" />

#### Overlapping elements {docsify-ignore}

The following example creates a group of overlapping items.

```
<AbsoluteLayout backgroundColor="#3c495e">
    <Label text="10,10" left="10" top="10" width="100" height="100" backgroundColor="#289062" />
    <Label text="30,40" left="30" top="40" width="100" height="100" backgroundColor="#43b883" />
</AbsoluteLayout>
```

<img class="md:w-1/2 lg:w-1/3" src="https://art.nativescript-vue.org/layouts/absolute_layout_overlap.svg" />

### Additional children props {docsify-ignore}

When an element is a direct child of `<AbsoluteLayout>`, you can work with the following additional properties.

| Name   | Type     | Description                                                                                               |
| ------ | -------- | --------------------------------------------------------------------------------------------------------- |
| `top`  | `Number` | Gets or sets the distance, in pixels, between the top edge of the child and the top edge of its parent.   |
| `left` | `Number` | Gets or sets the distance, in pixels, between the left edge of the child and the left edge of its parent. |
