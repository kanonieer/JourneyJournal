import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-5.x';
import { Cloudinary } from 'cloudinary-core';

import { LargeImagePage } from './largeImage';

@NgModule({
    declarations: [
        LargeImagePage
    ],
    imports: [
        IonicPageModule.forChild(LargeImagePage),
        CloudinaryModule.forRoot({Cloudinary}, { cloud_name: 'dzgtgeotp' } as CloudinaryConfiguration)
    ],
    entryComponents: [
        LargeImagePage
    ]
})

export class LargeImagePageModule { }
  