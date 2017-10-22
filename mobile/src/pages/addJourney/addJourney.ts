import { Component } from '@angular/core';
import { AuthService } from '../../providers/auth-service';
import { NavController } from 'ionic-angular';
import { JourneysPage } from '../journeys/journeys';

@Component({
  selector: 'page-addJourney',
  templateUrl: 'addJourney.html'
})
export class AddJourneyPage {

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
      alert("Journey was added");
      this.navCtrl.setRoot(JourneysPage);
    },
    err=>{
      alert("Journey wasn't added");
      console.log(err);
    }
    );
  };
}
