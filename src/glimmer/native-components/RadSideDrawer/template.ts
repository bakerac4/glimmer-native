import { precompile } from '@glimmer/compiler';

export default precompile(`<radSideDrawer ...attributes>
<radSideDrawer.drawerContent>
    <GridLayout>
        <Label text="Side Menu"></Label>
    </GridLayout>
</radSideDrawer.drawerContent>
<radSideDrawer.mainContent>
    {{yield}}
</radSideDrawer.mainContent>
</radSideDrawer>`);

// <nsDrawer:RadSideDrawer xmlns:nsDrawer="nativescript-ui-sidedrawer">
//     <nsDrawer:RadSideDrawer.drawerContent>
//         <GridLayout>
//             <Label text="Side Menu"></Label>
//         </GridLayout>
//     </nsDrawer:RadSideDrawer.drawerContent>
//     <nsDrawer:RadSideDrawer.mainContent>
//        <Frame defaultPage="./main-content-page"></Frame>
//     </nsDrawer:RadSideDrawer.mainContent>
// </nsDrawer:RadSideDrawer>
