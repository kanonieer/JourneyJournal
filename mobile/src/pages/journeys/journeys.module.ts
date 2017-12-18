import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-5.x';
import { Cloudinary } from 'cloudinary-core';

import { JourneysPage } from './journeys';

@NgModule({
    declarations: [
        JourneysPage
    ],
    imports: [
        IonicPageModule.forChild(JourneysPage),
        CloudinaryModule.forRoot({Cloudinary}, { cloud_name: 'dzgtgeotp' } as CloudinaryConfiguration)
    ],
    entryComponents: [
        JourneysPage
    ]
})

export class JourneysPageModule { }
  