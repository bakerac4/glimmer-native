import { precompile } from '@glimmer/compiler';

export default precompile(`
<template ...attributes
    {{set 'component' this false}}>
    {{yield}}
</template>`);
