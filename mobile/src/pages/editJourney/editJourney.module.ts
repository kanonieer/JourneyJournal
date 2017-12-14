import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { EditJourneyPage } from './editJourney';

@NgModule({
    declarations: [
        EditJourneyPage
    ],
    imports: [
        IonicPageModule.forChild(EditJourneyPage)
    ],
    entryComponents: [
        EditJourneyPage
    ]
})

export class EditJourneyPageModule { }
  