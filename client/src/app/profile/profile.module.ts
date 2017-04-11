import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ProfileComponent
  ],
  providers: [
  ],
  exports: [
    ProfileComponent
  ]
})
export class ProfileModule { }
