import { Component } from '@angular/core';
import { AuthService } from '../../providers/auth-service';
import { NavController } from 'ionic-angular';
import { TravelsPage } from '../travels/travels';

@Component({
  selector: 'page-addTravel',
  templateUrl: 'addTravel.html'
})
export class AddTravelPage {

  constructor(public navCtrl: NavController, private auth: AuthService) {}

  journeyCredentials={
        date_start   : '',
        date_end     : '',
        title        : '',
        id_disc      : '',
        access_token : localStorage.getItem('token')
  }
  
  AddJourney(){
    this.auth.addJourney(this.journeyCredentials).subscribe(
    data=>{
      alert("Udalo sie utworzyc podroz");
      this.navCtrl.setRoot(TravelsPage);
    },
    err=>{
      alert("Nie udalo sie utworzyc podrozy");
      console.log(err);
    }
    );
  };
}
