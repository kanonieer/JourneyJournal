import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { ModalController, AlertController, ViewController, NavController, NavParams, Events } from "ionic-angular";

// Providers
import { JourneyService } from "../../providers/journey-service";
import { uiComp } from "../../providers/ui-components";

@IonicPage()
@Component({
  selector: 'page-optionsJourney',
  templateUrl: 'optionsJourney.html',
  providers: [JourneyService, uiComp]
})

export class OptionsJourneyPage {

  public idJourney;
  public titleJourney;
  public loadedJourneys;

  constructor(public modalCtrl: ModalController, public alertCtrl: AlertController, public viewCtrl: ViewController, public navCtrl: NavController, public params: NavParams,
    public events: Events, private journeySvc: JourneyService, private uiCmp: uiComp) {

    this.startPopover(); 
  }

  // POPOVER //
  // Start
  public startPopover() {
    this.idJourney = this.params.get('id');
    this.titleJourney = this.params.get('title');
    this.loadedJourneys =  this.params.get('journeys');
  }

  // Close
  public closePopover() {
    this.viewCtrl.dismiss();
  }

  // NAV //
  // Back
  public backToJourneys() {
    this.events.publish('view:back');
  }

  // SETTINGS //
  // Modal
  public openSettings() {
    let modal = this.modalCtrl.create('SettingsPage', {modal: true});
    modal.present();
    this.closePopover();
  }

  // JOURNEYS //
  // Edit
  public editJourney() {
    let data = {
      id_journey: this.idJourney,
      title_journey: this.titleJourney
    };
    let modal = this.modalCtrl.create('EditJourneyPage', data);
    modal.present();
    this.closePopover();
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
    for(let i = 0; i < this.loadedJourneys.length; i++) {
      if(this.loadedJourneys[i]._id === this.idJourney) {
        this.journeySvc.deleteJourney(this.idJourney).subscribe(
          (result) => {
            this.loadedJourneys.splice(i, 1);
            this.reloadJourneys();
            this.backToJourneys();
            this.uiCmp.presentToastSuccess(result);
          },
          (error) => {
            this.uiCmp.presentToastError(error);
          }
        );
      }
    }
  }

  // Reload journeys
  public reloadJourneys() {
    this.events.publish('journeys:reload', this.loadedJourneys);
  }
}
