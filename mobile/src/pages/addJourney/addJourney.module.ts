import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { AddJourneyPage } from './addJourney';

@NgModule({
    declarations: [
        AddJourneyPage
    ],
    imports: [
        IonicPageModule.forChild(AddJourneyPage)
    ],
    entryComponents: [
        AddJourneyPage
    ]
})

export class AddJourneyPageModule { }
  