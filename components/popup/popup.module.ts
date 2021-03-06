import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {SuiTransitionModule} from "../transition/transition.module";
import {SuiPopupDirective} from './popup.directive';
import {SuiPopup} from './popup';
import {SuiPopupArrow} from './popup-arrow';

@NgModule({
    imports: [
        CommonModule,
        SuiTransitionModule
    ],
    declarations: [
        SuiPopupDirective,
        SuiPopupArrow,
        SuiPopup
    ],
    exports: [
        SuiPopupDirective,
        SuiPopup
    ],
    entryComponents: [
        SuiPopup
    ]
})
export class SuiPopupModule {}