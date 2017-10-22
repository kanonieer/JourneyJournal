import { Component, OnInit } from '@angular/core';
import { NavController, ViewController, Events } from 'ionic-angular';
import { Travel } from './../../models/Travel';
import { AddJourneyPage } from '../addJourney/addJourney';
import { DetailsJourneyPage} from '../detailsJourney/detailsJourney';
import { AboutPage } from '../about/about';
import { MapsPage } from '../maps/maps';
import { AuthService } from '../../providers/auth-service';

@Component({
  selector: 'page-journeys',
  templateUrl: 'journeys.html'
})
export class JourneysPage implements OnInit {

  addJourneyPage = AddJourneyPage;
  aboutPage = AboutPage;
  mapsPage = MapsPage;

  travels: Array<Travel> = []

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public events: Events, public travelService: AuthService) {
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

  public detailsJourney(id: string) {
    this.navCtrl.push(DetailsJourneyPage, {
      id_travel: id
    })
  }

  public deleteTravel(id: string) {
    this.travelService.deleteJourney({
      id_travel: id
    })
      .subscribe(
        result => console.log(result),
        err => console.log(err)
      );

      this.navCtrl.setRoot(JourneysPage);
  }
}