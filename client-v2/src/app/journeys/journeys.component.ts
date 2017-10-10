import { Component, OnInit } from '@angular/core';
import { JourneysService } from './journeys.service';

@Component({
  selector: 'app-journeys',
  templateUrl: './journeys.component.html',
  styleUrls: ['./journeys.component.css']
})
export class JourneysComponent implements OnInit {

  constructor(private journeysService: JourneysService) {
    this.journeysService
    .getJourneys()
    .subscribe((response) => console.log(response));
  }

  ngOnInit() {
  }
}
