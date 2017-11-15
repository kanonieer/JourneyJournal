import { Component } from '@angular/core';
import { NavController, ToastController, MenuController } from 'ionic-angular';

// Pages
import { JourneysPage } from '../journeys/journeys';

// Plugins
import { JourneyService } from '../../providers/journey-service';
import { StorageService } from '../../providers/storage-service';

@Component({
  selector: 'page-addJourney',
  templateUrl: 'addJourney.html'
})

export class AddJourneyPage {

  ionViewDidLoad() {
    this.menuCtrl.enable(false);
  }

  ionViewWillLeave() {
    this.menuCtrl.enable(true);
  }

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public menuCtrl: MenuController, private journeySvc: JourneyService, private storageSvc: StorageService) {

    this.journeyCredentials.date_start = new Date().toISOString();
    this.journeyCredentials.date_end = new Date().toISOString();
  }

  journeyCredentials = {
    date_start   : '',
    date_end     : '',
    title        : '',
    id_disc      : '',
    access_token : this.storageSvc.get('token')
  }
  
  AddJourney(){
    this.journeySvc.addJourney(this.journeyCredentials).subscribe(
      data => {
        this.navCtrl.setRoot(JourneysPage, {}, {animate: true, direction: 'forward'});
        this.presentToastSuccess(this.journeyCredentials.title + " was added");
      },
      err => {
        this.navCtrl.setRoot(JourneysPage, {}, {animate: true, direction: 'forward'});
        this.presentToastError(this.journeyCredentials.title + " wasn't added");
        console.log(err);
      }
    );
  };

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
