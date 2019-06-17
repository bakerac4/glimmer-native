import { UpdatableReference } from '@glimmer/component';

export default function(_args, vm) {
    // console.log(`in action`);
    let componentRef = vm.getSelf();
    // console.log(`componentRef: ${componentRef}`);
    let args = _args.capture();

    let actionFunc = args.positional.at(0).value() as Function;
    // console.log(actionFunc);
    // if (typeof actionFunc !== 'function') {
    //   throwNoActionError(actionFunc, args.positional.at(0));
    // }

    return new UpdatableReference(function action(...invokedArgs) {
        //   console.log(`in updatable reference`);
        let curriedArgs = args.positional.value();
        //   console.log(`in updatable reference: ${curriedArgs}`);
        // Consume the action function that was already captured above.
        curriedArgs.shift();

        curriedArgs.push(...invokedArgs);

        // Invoke the function with the component as the context, the curried
        // arguments passed to `{{action}}`, and the arguments the bound function
        // was invoked with.
        actionFunc.apply(componentRef && componentRef.value(), curriedArgs);
    });
}
