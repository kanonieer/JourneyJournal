import { Component, OnInit, Input } from '@angular/core';
import { Journey }                  from './../models/Journey';
import { JourneyService }           from './journey.service';

@Component({
  selector: 'app-journey',
  templateUrl: './journey.component.html',
  styleUrls: ['./journey.component.less']
})
export class JourneyComponent implements OnInit {

  @Input() journey: Journey;

  constructor(private journeyService: JourneyService) { }

  ngOnInit() { }

  getImages() {
    this.journeyService.getImages(this.journey._id)
      .subscribe(data => console.log(data.image));
  }

}