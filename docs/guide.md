# Introduction

<b>What is NativeScript?</b>

[NativeScript](https://www.nativescript.org) is an open-source framework to develop truly native applications for iOS and Android. It is open source and can be found on [Github](https://github.com/nativescript/nativescript)

<b>What is Glimmer?</b>

[Glimmer](https://glimmerjs.com/) is one of the fastest DOM rendering engines, delivering exceptional performance for initial renders as well as updates. Architected like a virtual machine (VM), Glimmer compiles your templates into low-level code so it can run as fast as possible—without sacrificing ease of use. It's also the Ember.js view layer.

<b>What is Glimmer Native</b>

Glimmer Native is a tool for building mobile applications. It combines NativeScript's access to the native platform views and Glimmer.js fast and efficient view updates to allow you to build native mobile experiences using tools such as HTMLBars, CSS and Javascript.

# Getting Started

## Installation

### Prerequisites {docsify-ignore}

-   [Node.js](#nodejs)
-   [Nativescript CLI](#nativescript)
-   [Ember CLI](#ember-cli)

#### Node.js {docsify-ignore}

Download and install the latest LTS version of Node.js from https://nodejs.org/. Restart your terminal and verify the installation was successful by running node --version.

#### Nativescript {docsify-ignore}

`$ npm install -g nativescript`
and then follow the instructions found [here](https://docs.nativescript.org/start/quick-setup#full-setup)

#### Ember CLI {docsify-ignore}

`$ npm install -g ember-cli`

## Create your application

Run the following command which will create a new glimmer native project using the [Glimmer Native Blueprint](https://github.com/bakerac4/glimmer-native-blueprint)

`ember new hello-glimmer-native -b glimmer-native-blueprint`

# Routing

There are two main ways to route to different pages

## LinkTo Component

Glimmer Native provides a LinkTo component for easy template navigation.
You must pass a string value for `@component` which tells Glimmer Native what component to render and navigate to.
You may also pass a model property, which you would access via `@model` inside the component that we are navigation to.

Inline form

```
<LinkTo
    @component="Edit"
    @model={{this.model}}
    @text="Edit Profile"
/>
```

Block Form

```
<LinkTo
    @component="Edit"
    @model={{this.model}}
>
    <User>
</LinkTo>
```

## Navigation Service

Glimmer Native also provides a `Navigation` service which will allow you to navigate to different pages in the backing component.

To use it, import it from Glimmer Native `import { Navigation } from 'glimmer-native';` and navigate away

```js
Navigation.navigate('Edit', model, NavigationOptions);
```

# Elements:Layouts

## Absolute Layout

[filename](layouts/absolute.md ':include')

## Dock Layout

[filename](layouts/dock.md ':include')

## Flexbox Layout

## Grid Layout

## Stack Layout

## Wrap Layout

# Elements:Components

# Elements:Dialogs
