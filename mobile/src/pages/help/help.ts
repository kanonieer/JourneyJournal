import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HowToAddJourneyPage } from '../help/howToAddJourney/howToAddJourney';

@Component({
  selector: 'page-help',
  templateUrl: 'help.html'
})

export class HelpPage {

  public subPages: Array<{ title: string, component: any }>;

  constructor(public navCtrl: NavController) {

    this.subPages = [
      {title: 'How to add new journey', component: HowToAddJourneyPage }
    ];
  }

  goToPage(subPages) {
    this.navCtrl.push(subPages);
  }
}
