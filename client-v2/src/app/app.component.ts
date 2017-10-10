import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { StorageService } from './shared/services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  name = 'Paweł';

  constructor() {}

}
