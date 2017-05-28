import { Component, OnInit } from '@angular/core';
import { JourneysService } from './journeys.service';
import { Journey } from './../models/Journey';

@Component({
  selector: 'app-journeys',
  templateUrl: './journeys.component.html',
  styleUrls: ['./journeys.component.less']
})
export class JourneysComponent implements OnInit {

  journeys: Array<Journey> = []

  constructor(private journeysService: JourneysService) { }

  ngOnInit() {
  }
  getJourneys() {
    this.journeysService.getJourneys()
      .subscribe(
        ( data:Array<Journey> ) => {
          this.journeys = data;
        },
         err =>  console.log(err)
      );
  } 

}