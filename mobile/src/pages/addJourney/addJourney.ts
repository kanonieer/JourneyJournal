import { Component } from '@angular/core';
import { AuthService } from '../../providers/auth-service';
import { NavController, ToastController, MenuController } from 'ionic-angular';

import { JourneysPage } from '../journeys/journeys';

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

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public menuCtrl: MenuController, private auth: AuthService) {

  }

  journeyCredentials = {
    date_start   : '',
    date_end     : '',
    title        : '',
    id_disc      : '',
    access_token : localStorage.getItem('token')
  }
  
  AddJourney(){
    this.auth.addJourney(this.journeyCredentials).subscribe(
      data=>{
        this.presentToast("Journey was added");
        this.navCtrl.setRoot(JourneysPage);
      },
      err=>{
        this.presentToast("Journey wasn't added");
        console.log(err);
      }
    );
  };

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: "bottom"
    });
    toast.present();
  }
}
