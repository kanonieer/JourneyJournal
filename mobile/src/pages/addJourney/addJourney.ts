import { Component } from '@angular/core';
import { NavController, ToastController, MenuController } from 'ionic-angular';

import { JourneysPage } from '../journeys/journeys';

import { JourneyService } from '../../providers/journey-service';

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

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public menuCtrl: MenuController, private journeySvc: JourneyService) {

    this.journeyCredentials.date_start = new Date().toISOString();
    this.journeyCredentials.date_end = new Date().toISOString();
  }

  journeyCredentials = {
    date_start   : '',
    date_end     : '',
    title        : '',
    id_disc      : '',
    access_token : localStorage.getItem('token')
  }
  
  AddJourney(){
    this.journeySvc.addJourney(this.journeyCredentials).subscribe(
      data => {
        this.presentToastSuccess(this.journeyCredentials.title + " was added");
        this.navCtrl.setRoot(JourneysPage);
      },
      err => {
        this.presentToastError(this.journeyCredentials.title + " wasn't added");
        this.navCtrl.setRoot(JourneysPage);
        console.log(err);
      }
    );
  };

  private presentToastSuccess(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: "bottom",
      cssClass: "success"
    });
    toast.present();
  }

  private presentToastError(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: "bottom",
      cssClass: "error"
    });
    toast.present();
  }
}
