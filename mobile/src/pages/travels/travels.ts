import { Component } from '@angular/core';

import { NavController, ActionSheetController, Events } from 'ionic-angular';

import { AddTravelPage } from '../addTravel/addTravel';
import { DetailsTravelPage} from '../detailsTravel/detailsTravel';
import { AboutPage } from '../about/about';
import { LoginPage } from '../login/login';

@Component({
  selector: 'travels',
  templateUrl: 'travels.html'
})
export class TravelsPage {

  addTravelPage = AddTravelPage;
  detailsTravelPage = DetailsTravelPage;
  loginPage = LoginPage;

  constructor(public navCtrl: NavController, public actionSheetController: ActionSheetController, public events: Events) {

  }

  public presentActionSheet() {
    let actionSheet = this.actionSheetController.create({
      title: "Settings",
      buttons: [
        {
          text: 'Dropbox',
          handler: () => {
            console.log("Dropbox clicked");            
         }
       },
       {
         text: 'About',
         handler: () => {
           this.navCtrl.push(AboutPage);
         }
       },
       {
         text: 'Logout',
         role: 'destructive',
         handler: () => {
           this.events.publish('user:logout');
         }
        }
      ]
    });
    actionSheet.present();
  }
}
