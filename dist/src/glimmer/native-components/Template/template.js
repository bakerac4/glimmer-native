import { precompile } from '@glimmer/compiler';
export default precompile(`<template ...attributes>{{yield this}}</template>`);
