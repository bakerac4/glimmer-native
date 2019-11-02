import { ContentView } from 'tns-core-modules/ui/content-view';
import { View } from 'tns-core-modules/ui/core/view';
import { LayoutBase } from 'tns-core-modules/ui/layouts/layout-base';
export function isView(view) {
    return view instanceof View;
}
export function isLayout(view) {
    return view instanceof LayoutBase;
}
export function isContentView(view) {
    return view instanceof ContentView;
}
