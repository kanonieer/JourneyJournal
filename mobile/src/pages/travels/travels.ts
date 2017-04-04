import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { AddTravelPage } from '../addTravel/addTravel';
import { DetailsTravelPage} from '../detailsTravel/detailsTravel';

@Component({
  selector: 'travels',
  templateUrl: 'travels.html'
})
export class TravelsPage {

  addTravelPage = AddTravelPage;
  detailsTravelPage = DetailsTravelPage;

  constructor(public navCtrl: NavController) {

  }
}
