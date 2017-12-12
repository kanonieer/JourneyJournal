import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { MenuController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-howToAddJourney',
  templateUrl: 'howToAddJourney.html'
})

export class HowToAddJourneyPage {

  ionViewDidLoad() {
    this.menuCtrl.enable(false);
  }

  ionViewWillLeave() {
    this.menuCtrl.enable(true);
  }

  constructor(public menuCtrl: MenuController) {
  }
}
