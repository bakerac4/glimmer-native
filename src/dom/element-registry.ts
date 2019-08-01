import ElementNode from './nodes/ElementNode';

const elementMap = {};
const dashRegExp = /-/g;

const defaultViewMeta = {
    skipAddToDom: false,
    isUnaryTag: false,
    tagNamespace: '',
    canBeLeftOpenTag: false,
    component: null
};

export function normalizeElementName(elementName) {
    // console.log(`Normalize Element name ${elementName}`);
    return `${elementName.replace(dashRegExp, '').toLowerCase()}`;
}
// export function registerNativeElement(elementName: string, resolver: () => typeof View, meta: ComponentMeta = null) {
//     registerElement(elementName, () => new NativeNode(elementName, resolver(), meta));
// }

export function registerElement(elementName, resolver, meta = null) {
    const normalizedName = normalizeElementName(elementName);

    meta = Object.assign({}, defaultViewMeta, meta);

    if (elementMap[normalizedName]) {
        throw new Error(`Element for ${elementName} already registered.`);
    }

    const entry = {
        resolver: resolver,
        meta: meta
    };
    elementMap[normalizedName] = entry;
}

export function getElementMap() {
    return elementMap;
}

export function getViewClass(elementName) {
    const normalizedName = normalizeElementName(elementName);
    const entry = elementMap[normalizedName];

    if (!entry) {
        throw new TypeError(`No known component for element ${elementName}.`);
    }

    try {
        return entry.resolver();
    } catch (e) {
        throw new TypeError(`Could not load view for: ${elementName}. ${e}`);
    }
}

export function getViewMeta(elementName) {
    const normalizedName = normalizeElementName(elementName);

    let meta = defaultViewMeta;
    const entry = elementMap[normalizedName];

    if (entry && entry.meta) {
        meta = entry.meta;
    }

    return meta;
}

export function isKnownView(elementName) {
    return elementMap[normalizeElementName(elementName)];
}

export function createElement(elementName: string): ElementNode {
    const normalizedName = normalizeElementName(elementName);
    const elementDefinition = elementMap[normalizedName];
    if (!elementDefinition) {
        throw new TypeError(`No known component for element ${elementName}.`);
    }
    return elementDefinition.resolver();
}
