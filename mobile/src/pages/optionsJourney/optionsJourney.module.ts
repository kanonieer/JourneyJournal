import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { OptionsJourneyPage } from './optionsJourney';

@NgModule({
    declarations: [
        OptionsJourneyPage
    ],
    imports: [
        IonicPageModule.forChild(OptionsJourneyPage)
    ],
    entryComponents: [
        OptionsJourneyPage
    ]
})

export class OptionsJourneyPageModule { }
  