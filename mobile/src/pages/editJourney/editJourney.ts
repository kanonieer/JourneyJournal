import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavParams, ViewController, ToastController, Events} from 'ionic-angular';

// Providers
import { JourneyService } from '../../providers/journey-service';

@Component({
  selector: 'page-editJourney',
  templateUrl: 'editJourney.html',
  providers: [JourneyService]
})

export class EditJourneyPage {

  modal;
  journey_id = this.params.get('id_journey');

  journeyCredentials = {
    title: this.params.get('title_journey'),
    date_start: '',
    date_end: ''
  };

  constructor(public params: NavParams, public viewCtrl: ViewController, private toastCtrl: ToastController, public events: Events, private journeySvc: JourneyService) {
  }

  editJourney(form: NgForm) {
    this.journeySvc.editJourney(this.journey_id, form.value).subscribe(
      (data) => {
        console.log(JSON.stringify(form.value, null, 4));
        
        this.reload();
        this.dismiss();
        this.presentToastSuccess(data.message);
      },
      (error) => {
        this.presentToastError(error.message);
      }
    );
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  reload() {
    this.events.publish('journey:get');
  }

  private presentToastSuccess(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 1500,
      position: "bottom",
      cssClass: "success"
    });
    toast.present();
  }

  private presentToastError(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 1500,
      position: "bottom",
      cssClass: "error"
    });
    toast.present();
  }
}
