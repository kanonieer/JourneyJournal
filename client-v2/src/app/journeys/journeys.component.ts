import { Component, OnInit } from '@angular/core';

import { JourneysService } from './journeys.service';
import { Journey } from './../shared/models/Journey';

@Component({
  selector: 'app-journeys',
  templateUrl: './journeys.component.html',
  styleUrls: ['./journeys.component.less']
})
export class JourneysComponent implements OnInit {
  private journeys: Journey[] = [];

  constructor(private journeysService: JourneysService) {
    this.journeysService
    .getJourneys()
    .subscribe(journeys => this.journeys = journeys);
  }

  ngOnInit() {
  }
}
