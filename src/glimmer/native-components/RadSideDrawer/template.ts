import { precompile } from '@glimmer/compiler';

export default precompile(`<radSideDrawer ...attributes />
<DrawerSide @rendered={{action this.sideInserted}}>
    {{yield to="side"}}
</DrawerSide>
<DrawerMain @rendered={{action this.mainInserted}}>>
    {{yield}}
</DrawerMain>
`);

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
