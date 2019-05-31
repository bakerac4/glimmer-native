import Component from '@glimmer/component';
export default class ListView extends Component {
    item: any;
    yieldItem(item: any): void;
    didInsertElement(): void;
}
