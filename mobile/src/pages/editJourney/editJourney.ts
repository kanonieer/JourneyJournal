import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NavParams, ViewController, Events } from 'ionic-angular';

// Providers
import { JourneyService } from '../../providers/journey-service';
import { StorageService } from '../../providers/storage-service';
import { uiComp } from '../../providers/ui-components';

@IonicPage()
@Component({
  selector: 'page-editJourney',
  templateUrl: 'editJourney.html',
  providers: [JourneyService, StorageService, uiComp]
})

export class EditJourneyPage {

  public modal;
  public journey_id = this.params.get('id_journey');

  public journeyCredentials = {
    title: this.params.get('title_journey'),
    date_start: '',
    date_end: '',
    access_token : this.storageSvc.get('token')
  };

  constructor(public params: NavParams, public viewCtrl: ViewController, public events: Events, private journeySvc: JourneyService, private storageSvc: StorageService,
    private uiCmp: uiComp) {
  }

  // JOURNEYS //
  // Edit
  public editJourney() {
    this.journeySvc.editJourney(this.journey_id, this.journeyCredentials).subscribe(
      (data) => {
        this.reloadJourney();
        this.updateTitle(this.journeyCredentials.title);
        this.dismiss();
        this.uiCmp.presentToastSuccess(data.message);
      },
      (error) => {
        this.uiCmp.presentToastError(error.message);
      }
    );
  }

  // Reload journeys
  public reloadJourney() {
    this.events.publish('journeys:get');
  }

  // Update title
  public updateTitle(title) {
    this.events.publish('journey:update', title);
  }

  // MODALS //
  // Dismiss
  public dismiss() {
    this.viewCtrl.dismiss();
  }
}
