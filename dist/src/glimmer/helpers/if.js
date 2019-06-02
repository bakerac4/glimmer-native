export default function (_vm, args) {
    let ifValue = args.at(0).value();
    console.log(`If value: ${ifValue}`);
    let truthy = args.positional.at(1).value();
    console.log(`Truthy: ${truthy}`);
    let falsy = args.positional.at(2).value();
    console.log(`Falsy: ${falsy}`);
    return ifValue ? truthy : falsy;
}
