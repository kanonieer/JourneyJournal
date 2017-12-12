import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-5.x';
import { Cloudinary } from 'cloudinary-core';

import { DetailsJourneyPage } from './detailsJourney';

@NgModule({
    declarations: [DetailsJourneyPage],
    imports: [
        IonicPageModule.forChild(DetailsJourneyPage),
        CloudinaryModule.forRoot({Cloudinary}, { cloud_name: 'dzgtgeotp' } as CloudinaryConfiguration)
    ]
})

export class DetailsJourneyPageModule { }
  