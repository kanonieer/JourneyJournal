import { Component, OnInit }              from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Image }                          from './../models/Image';
import { JourneyService }                 from './../journey/journey.service';
import { Observable }                     from 'rxjs/Observable';

import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-explore-journey',
  templateUrl: './explore-journey.component.html',
  styleUrls: ['./explore-journey.component.less']
})
export class ExploreJourneyComponent implements OnInit {

  journey_id: String = '';
  images: Array<Image> = [];

  constructor(
    private journeyService: JourneyService,
    private activatedRoute: ActivatedRoute,
    private router: Router
   ) { }


  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.journey_id = params['id'];
      let data1;
      this.journeyService.getImages(this.journey_id)
        .subscribe(data => {
          this.images = data.images;
          console.log(this.images);
        });
    });
  }

}
