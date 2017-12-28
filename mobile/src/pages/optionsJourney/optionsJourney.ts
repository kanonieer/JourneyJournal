import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { ModalController, AlertController, ViewController, NavController, NavParams } from "ionic-angular";

// Providers
import { JourneyService } from "../../providers/journey-service";
import { uiComp } from "../../providers/ui-components";

// Shared
import { navOptionsBack } from '../../shared/GlobalVariables';

@IonicPage()
@Component({
  selector: 'page-optionsJourney',
  templateUrl: 'optionsJourney.html',
  providers: [JourneyService, uiComp]
})

export class OptionsJourneyPage {

  public idJourney;
  public titleJourney;

  constructor(public modalCtrl: ModalController, public alertCtrl: AlertController, public viewCtrl: ViewController, public navCtrl: NavController, public params: NavParams,
    private journeySvc: JourneyService, private uiCmp: uiComp) {

    this.startPopover(); 
  }

  // POPOVER //
  // Start
  public startPopover() {
    this.idJourney = this.params.get('id');
    this.titleJourney = this.params.get('title');
  }

  // Close
  public closePopover() {
    this.viewCtrl.dismiss();
  }

  // SETTINGS //
  // Modal
  public openSettings() {
    let modal = this.modalCtrl.create('SettingsPage', {modal: true});
    modal.present();
  }

  // JOURNEYS //
  // Edit
  public editJourney() {
    let data = {
      id_journey: this.idJourney,
      title_journey: this.titleJourney
    };
    let modal = this.modalCtrl.create('EditJourneyPage', data);
    this.closePopover();
    modal.present();
  }

  // Confirm
  public deleteConfirm() {
    this.closePopover();
    const alert = this.alertCtrl.create({
      title: 'Confirm delete',
      message: 'Do you want to delete ' + this.titleJourney + '?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteJourney();
          }
        }
      ]
    });
    alert.present();
  }

  // Delete
  public deleteJourney() {
    this.journeySvc.deleteJourney(this.idJourney).subscribe(
      (result) => {
        this.uiCmp.presentToastSuccess(result);
      },
      (error) => {
        this.uiCmp.presentToastError(error);
      }
    );
    this.navCtrl.setRoot('JourneysPage', {}, navOptionsBack);
  }
}
