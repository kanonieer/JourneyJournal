import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { JourneysPage } from './journeys';

@NgModule({
    declarations: [
        JourneysPage
    ],
    imports: [
        IonicPageModule.forChild(JourneysPage)
    ],
    entryComponents: [
        JourneysPage
    ]
})

export class JourneysPageModule { }
  