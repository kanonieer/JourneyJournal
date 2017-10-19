import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ImageService } from './../shared/services/image.service';
import { Journey } from './../shared/models/Journey';
import { Image } from './../shared/models/Image';

@Component({
  selector: 'app-journey',
  templateUrl: './journey.component.html',
  styleUrls: ['./journey.component.less']
})
export class JourneyComponent implements OnInit {

  public journey: Journey;
  public images: Image[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private imageService: ImageService
  ) {
    this.activatedRoute.params.subscribe((params: Params) => {
      const journey_id = params['id'];

      this.imageService.getImagesByJourney(journey_id)
        .subscribe(data => this.images = data.images);
    });
  }

  ngOnInit() {
  }

}
