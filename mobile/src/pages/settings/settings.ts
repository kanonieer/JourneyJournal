import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { AboutPage } from "../about/about";

@Component({
  selector: 'settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  aboutPage = AboutPage;

  constructor(public navCtrl: NavController) {

  }

}