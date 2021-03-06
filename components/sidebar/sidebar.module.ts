import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {SuiSidebar} from './sidebar';
import {SuiSidebarContainer} from './sidebar-container';
import {SuiSidebarSibling} from './sidebar-sibling';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        SuiSidebar,
        SuiSidebarContainer,
        SuiSidebarSibling
    ],
    exports: [
        SuiSidebar,
        SuiSidebarContainer,
        SuiSidebarSibling
    ]
})
export class SuiSidebarModule {}
