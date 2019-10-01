import Application, { NativeCapabilities } from '../../..';
export default function registerComponentHelper(params) {
    let componentName = params[0];
    let template = params[1];
    const handle = Application.resolver.registerComponent(componentName, new Object());
    Application.resolverDelegate.registerComponent(componentName, handle, template, NativeCapabilities);
}
