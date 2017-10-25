import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Journey } from './../../models/Journey';
import { AuthService } from '../../providers/auth-service';

import { AddJourneyPage } from '../addJourney/addJourney';
import { DetailsJourneyPage} from '../detailsJourney/detailsJourney';
import { AboutPage } from '../about/about';
import { MapsPage } from '../maps/maps';

@Component({
  selector: 'page-journeys',
  templateUrl: 'journeys.html'
})

export class JourneysPage implements OnInit {

  addJourneyPage = AddJourneyPage;
  aboutPage = AboutPage;
  mapsPage = MapsPage;

  travels: Array<Journey> = []

  constructor(public navCtrl: NavController, private journeyService: AuthService) {
    this.getJourneys();
  }

  ngOnInit() {
  }

  getJourneys() {
    this.journeyService.getJourneys().subscribe((
      data:Array<Journey>) => {
        this.travels = data;
      }, 
      err => console.log(err)
    );
  }

  public detailsJourney(id: string) {
    this.navCtrl.push(DetailsJourneyPage, {
      id_travel: id
    });
  }

  deleteJourney(id: string) {
    console.log(id);
    
    this.journeyService.deleteJourney(id).subscribe(
        result => console.log(result),
        err => console.log(err)
      );

      this.navCtrl.setRoot(JourneysPage);
  }
}