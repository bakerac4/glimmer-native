'use strict';
/* eslint-env jest */
/* eslint-env node */

import { isView, isLayout, isContentView } from './utils';
import { ContentView } from 'tns-core-modules/ui/content-view';
import { View } from 'tns-core-modules/ui/core/view';
import { LayoutBase } from 'tns-core-modules/ui/layouts/layout-base';

function assert(left, right) {
    expect(left).toEqual(right);
}

it('isView', () => {
    assert(isView(View), true);
    assert(isView(LayoutBase), false);
});

it('isLayout', () => {
    assert(isLayout(View), false);
    assert(isLayout(LayoutBase), true);
});

it('isContentView', () => {
    assert(isContentView(ContentView), true);
    assert(isContentView(LayoutBase), false);
});
