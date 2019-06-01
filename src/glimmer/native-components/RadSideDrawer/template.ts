import { precompile } from '@glimmer/compiler';

export default precompile(`<radSideDrawer ...attributes>
{{yield (hash
    main="DrawerMain"
    drawer="DrawerSide"
)}}
</radSideDrawer>`);
