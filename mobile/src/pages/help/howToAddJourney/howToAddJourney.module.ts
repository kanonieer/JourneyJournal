import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { HowToAddJourneyPage } from './howToAddJourney';

@NgModule({
    declarations: [
        HowToAddJourneyPage
    ],
    imports: [
        IonicPageModule.forChild(HowToAddJourneyPage)
    ]
    ,entryComponents: [
        HowToAddJourneyPage
    ]
})

export class HowToAddJourneyPageModule { }
  