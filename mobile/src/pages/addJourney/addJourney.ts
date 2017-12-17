import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NavController, MenuController, ViewController } from 'ionic-angular';

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

  public journeyCredentials = {
    title        : '',
    description  : '',
    date_start   : '',
    date_end     : '',
    access_token : this.storageSvc.get('token')
  }

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, public viewCtrl: ViewController, private journeySvc: JourneyService, private storageSvc: StorageService,
    private uiCmp: uiComp) {
  }

  // JOURNEYS //
  // Add
  public addJourney(){
    this.journeySvc.addJourney(this.journeyCredentials).subscribe(
      (data) => {
        this.navCtrl.setRoot('JourneysPage', {}, navOptionsBack);
        this.uiCmp.presentToastSuccess(this.journeyCredentials.title + " was added");
      },
      (err) => {
        this.navCtrl.setRoot('JourneysPage', {}, navOptionsBack);
        this.uiCmp.presentToastError(this.journeyCredentials.title + " wasn't added");
      }
    );
  };

  // NAV //
  // Back
  public back() {
    this.navCtrl.pop(navOptionsBack);
  }
}
