import { Component } from '@angular/core';
import { MenuController } from 'ionic-angular';

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
