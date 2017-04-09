import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';

import { AuthService } from './../services/auth.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ProfileComponent
  ],
  providers: [
    AuthService
  ],
  exports: [
    ProfileComponent
  ]
})
export class ProfileModule { }
