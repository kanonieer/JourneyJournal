import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JourneysComponent } from './journeys.component';
import { JourneyModule } from './../journey/journey.module';
import { JourneysService } from './journeys.service';

@NgModule({
  imports: [
    CommonModule,
    JourneyModule
  ],
  declarations: [
    JourneysComponent
  ],
  exports: [
    JourneysComponent
  ],
  providers: [
    JourneysService
  ]
})
export class JourneysModule { }
