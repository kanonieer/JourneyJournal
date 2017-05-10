import { NgModule }               from '@angular/core';
import { CommonModule }           from '@angular/common';
import { RouterModule }           from '@angular/router';
import { FormsModule }            from '@angular/forms';

import { ProfileComponent }       from './profile.component';
import { PasswordComponent }      from './password/password.component';
import { EmailComponent }         from './email/email.component';
import { AddFaceAuthComponent }   from './add-face-auth/add-face-auth.component';
import { AddEmailAuthComponent }  from './add-email-auth/add-email-auth.component';

import { AccountService }         from './account.service';
import { LogoutService }          from './../logout.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  declarations: [
    ProfileComponent,
    PasswordComponent,
    EmailComponent,
    AddFaceAuthComponent,
    AddEmailAuthComponent
  ],
  providers: [
    AccountService,
    LogoutService
  ],
  exports: [
    ProfileComponent
  ]
})
export class ProfileModule { }
