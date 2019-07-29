import ViewNode from './ViewNode';
export default class ElementNode extends ViewNode {
    constructor(tagName) {
        super();
        this.nodeType = 1;
        this.tagName = tagName;
    }
    get id() {
        return this.getAttribute('id');
    }
    set id(value) {
        this.setAttribute('id', value);
    }
    get classList() {
        if (!this._classList) {
            const getClasses = () => (this.getAttribute('class') || '').split(/\s+/).filter((k) => k != '');
            this._classList = {
                add: (...classNames) => {
                    this.setAttribute('class', [...new Set(getClasses().concat(classNames))].join(' '));
                },
                remove: (...classNames) => {
                    this.setAttribute('class', getClasses()
                        .filter((i) => classNames.indexOf(i) == -1)
                        .join(' '));
                },
                get length() {
                    return getClasses().length;
                }
            };
        }
        return this._classList;
    }
    appendChild(childNode) {
        super.appendChild(childNode);
        if (childNode.nodeType === 3) {
            this.setText(childNode.text);
        }
        if (childNode.nodeType === 7) {
            childNode.setOnNode(this);
        }
    }
    insertBefore(childNode, referenceNode) {
        super.insertBefore(childNode, referenceNode);
        if (childNode.nodeType === 3) {
            this.setText(childNode.text);
        }
        if (childNode.nodeType === 7) {
            childNode.setOnNode(this);
        }
    }
    removeChild(childNode) {
        super.removeChild(childNode);
        if (childNode.nodeType === 3) {
            this.setText('');
        }
        if (childNode.nodeType === 7) {
            childNode.clearOnNode(this);
        }
    }
}
