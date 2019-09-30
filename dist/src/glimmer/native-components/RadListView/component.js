var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Component from '@glimmer/component';
import { action } from '../../decorators/action';
export default class RadListView extends Component {
    loaded(event) {
        // this.args.loaded(event);
        const view = event.object;
        const keys = Object.keys(this.args);
        const nativeKeys = keys.filter((item) => item.startsWith('native'));
        nativeKeys.forEach((key) => {
            const actualKey = key.split(':')[1];
            view[actualKey] = this.args[key];
        });
        // return true;
    }
}
__decorate([
    action
], RadListView.prototype, "loaded", null);
