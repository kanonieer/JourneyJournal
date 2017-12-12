import { Component } from '@angular/core';
import { NavParams, ViewController, ToastController, Events} from 'ionic-angular';

// Providers
import { JourneyService } from '../../providers/journey-service';
import { StorageService } from '../../providers/storage-service';

@Component({
  selector: 'page-editJourney',
  templateUrl: 'editJourney.html',
  providers: [JourneyService]
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

  constructor(public params: NavParams, public viewCtrl: ViewController, public toastCtrl: ToastController, public events: Events, private journeySvc: JourneyService,
    private storageSvc: StorageService) {
  }

  // JOURNEYS //
  // Edit
  public editJourney() {
    this.journeySvc.editJourney(this.journey_id, this.journeyCredentials).subscribe(
      (data) => {
        this.reload();
        this.dismiss();
        this.presentToastSuccess(data.message);
      },
      (error) => {
        this.presentToastError(error.message);
      }
    );
  }

  // Reload
  public reload() {
    this.events.publish('journey:get');
  }

  // MODALS //
  // Dismiss
  public dismiss() {
    this.viewCtrl.dismiss();
  }

  // TOASTS //
  // Success
  public presentToastSuccess(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 1500,
      position: "bottom",
      cssClass: "success"
    });
    toast.present();
  }

  // Error
  public presentToastError(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 1500,
      position: "bottom",
      cssClass: "error"
    });
    toast.present();
  }
}
