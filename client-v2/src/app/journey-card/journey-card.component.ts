import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Journey } from './../shared/models/Journey';

@Component({
  selector: 'app-journey-card',
  templateUrl: './journey-card.component.html',
  styleUrls: ['./journey-card.component.less']
})
export class JourneyCardComponent implements OnInit {

  @Input() private journey: Journey;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  public navigateToJourney() {
    this.router.navigateByUrl('journeys/' + this.journey._id);
  }
}
