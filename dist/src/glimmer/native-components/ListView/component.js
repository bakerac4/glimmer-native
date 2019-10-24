import Component from '@glimmer/component';
import { GlimmerKeyedTemplate } from '../../../dom/native/ListViewElement';
export default class ListView extends Component {
    // @action
    get keyedTemplates() {
        const keyedTemplateNames = this.args.keyedTemplates;
        if (Array.isArray(keyedTemplateNames)) {
            return keyedTemplateNames.map((name) => {
                return new GlimmerKeyedTemplate(name);
            });
        }
        else {
            return [];
        }
    }
}
