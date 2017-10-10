import { Component, OnInit, Input } from '@angular/core';

import { Image } from './../shared/models/Image';

@Component({
  selector: 'app-polaroid',
  templateUrl: './polaroid.component.html',
  styleUrls: ['./polaroid.component.css']
})
export class PolaroidComponent implements OnInit {

  // @Input()
  // private image: Image;

  constructor() {}

  ngOnInit() {
  }
}
