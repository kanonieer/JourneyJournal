import { Component, OnInit } from '@angular/core';
import { NavController, ActionSheetController, Events } from 'ionic-angular';
import { Travel } from './../../models/Travel';
import { AddTravelPage } from '../addTravel/addTravel';
import { DetailsTravelPage} from '../detailsTravel/detailsTravel';
import { AboutPage } from '../about/about';
import { LoginPage } from '../login/login';
import { AuthService } from '../../providers/auth-service';

@Component({
  selector: 'travels',
  templateUrl: 'travels.html'
})
export class TravelsPage implements OnInit {

  addTravelPage = AddTravelPage;
  detailsTravelPage = DetailsTravelPage;
  loginPage = LoginPage;

  travels: Array<Travel> = []

  constructor(public navCtrl: NavController, public actionSheetController: ActionSheetController, public events: Events, public travelService: AuthService) {
    this.getJourneys();
  }

  ngOnInit() {
  }

  getJourneys() {
    this.travelService.getJourneys()
      .subscribe(
        (data:Array<Travel>) => {
          this.travels = data;
        },
         err =>  console.log(err)
      );
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

  public detailsTravel(id: string) {
    this.navCtrl.push(DetailsTravelPage, {
      id_travel: id
    })
  }
}
