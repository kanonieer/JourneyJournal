import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JourneysComponent } from './journeys.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    JourneysComponent
  ],
  exports: [
    JourneysComponent
  ]
})
export class JourneysModule { }
