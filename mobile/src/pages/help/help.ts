import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

// Pages
import { HowToAddJourneyPage } from '../help/howToAddJourney/howToAddJourney';

@Component({
  selector: 'page-help',
  templateUrl: 'help.html'
})

export class HelpPage {

  public subPages: Array<{ title: string, component: any }> = [];

  constructor(public navCtrl: NavController) {
    
    this.subPages.push(
      {title: 'How to add new journey', component: HowToAddJourneyPage }
    );
  }

  // MENU //
  // Go to sub page
  public goToPage(subPages) {
    this.navCtrl.push(subPages);
  }
}
