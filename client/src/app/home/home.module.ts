import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { HomeComponent }  from './home.component';
import { LogoutService }  from './../logout.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    HomeComponent
  ],
  providers: [

  ],
  exports: [
    HomeComponent
  ]
})
export class HomeModule { }
