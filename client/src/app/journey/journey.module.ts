import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JourneyComponent } from './journey.component';
import { JourneyService } from './journey.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    JourneyComponent
  ],
  providers: [
    JourneyService
  ],
  exports: [
    JourneyComponent
  ]
})
export class JourneyModule { }
