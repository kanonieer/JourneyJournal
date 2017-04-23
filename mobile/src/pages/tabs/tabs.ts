import { Component } from '@angular/core';

import { TravelsPage } from '../travels/travels';
import { SettingsPage } from '../settings/settings';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tabTravels: any = TravelsPage;
  tabSettings: any = SettingsPage;

  constructor() {

  }
}
