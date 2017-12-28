import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NavController, NavParams, MenuController, ViewController, Events } from 'ionic-angular';

// Providers
import { JourneyService } from '../../providers/journey-service';
import { StorageService } from '../../providers/storage-service';
import { uiComp } from '../../providers/ui-components';

// Shared
import { navOptionsBack } from '../../shared/GlobalVariables';

@IonicPage()
@Component({
  selector: 'page-addJourney',
  templateUrl: 'addJourney.html',
  providers: [JourneyService, StorageService, uiComp]
})

export class AddJourneyPage {

  ionViewDidLoad() {
    this.menuCtrl.enable(false);
    this.viewCtrl.showBackButton(false);
  }

  ionViewWillLeave() {
    this.menuCtrl.enable(true);
  }

  public journeys = [];

  public journeyCredentials = {
    title        : '',
    description  : '',
    date_start   : '',
    date_end     : '',
    access_token : this.storageSvc.get('token')
  }

  constructor(public navCtrl: NavController, public params: NavParams, public menuCtrl: MenuController, public viewCtrl: ViewController, public events: Events,
    private journeySvc: JourneyService, private storageSvc: StorageService, private uiCmp: uiComp) {

    this.getLoadedJourneys();
  }

  // JOURNEYS //
  // Add
  public addJourney(){
    this.journeySvc.addJourney(this.journeyCredentials).subscribe(
      (data) => {
        this.journeys.push(data.data);
        this.reloadJourneys();
        this.backToJourneys();
        this.uiCmp.presentToastSuccess('\"' + this.journeyCredentials.title + '\" was added');
      },
      (err) => {
        this.backToJourneys();
        this.uiCmp.presentToastError('\"' + this.journeyCredentials.title + '\" wasn\'t added');
      }
    );
  };

  // Get loaded journeys
  public getLoadedJourneys() {
    this.journeys = this.params.get('journeys');
  }

  // Reload journeys on previous page
  public reloadJourneys() {
    this.events.publish('journeys:reload', this.journeys);
  }

  // NAV //
  // Back
  public backToJourneys() {
    this.navCtrl.pop(navOptionsBack);
  }
}
