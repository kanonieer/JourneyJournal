import { NgModule }             from '@angular/core';
import { CommonModule }         from '@angular/common';
import { FormsModule }          from '@angular/forms';
import { RouterModule }         from '@angular/router';

import { AuthComponent }        from './auth.component';
import { FacebookComponent }    from './facebook/facebook.component';
import { SignUpLoginComponent } from './sign-up-login/sign-up-login.component';

import { AuthService }          from './auth.service';
import { AUTH_ROUTES }          from './auth.routing';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  providers: [
    AuthService
  ],
  declarations: [
    AuthComponent,
    FacebookComponent,
    SignUpLoginComponent
  ]
})
export class AuthModule { }
