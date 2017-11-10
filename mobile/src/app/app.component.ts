import { Component, ViewChild } from '@angular/core';
import { Platform, App, LoadingController, Loading, Nav, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';

import { LoginPage } from '../pages/login/login';
import { JourneysPage } from '../pages/journeys/journeys';
import { MapsPage } from '../pages/maps/maps';
import { AboutPage } from '../pages/about/about';
import { SettingsPage } from '../pages/settings/settings';
import { HelpPage } from '../pages/help/help';

@Component({
  selector: 'page-app',
  templateUrl: 'app.html'
})

export class MyApp {
  
  @ViewChild('menu') menu: Nav;
  loading: Loading;

  public rootPage: any;
  public pages: Array<{ title: string, component: any, icon: string }>;
  
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, app: App, public events: Events, public loadingCtrl: LoadingController, public keyboard: Keyboard) {

    this.rootPage = LoginPage;
    this.pages = [
      {title: 'Journeys', component: JourneysPage, icon: 'images'},
      {title: 'Maps', component: MapsPage, icon: 'map'},
      {title: 'About', component: AboutPage, icon: 'information-circle'},
      {title: 'Help', component: HelpPage, icon: 'help-circle'}
    ];

    platform.ready().then(() => {

      if((localStorage.getItem('user_logged') == 'true') || (localStorage.getItem('user_logged_fb') == 'true')) {
        app.getActiveNav().setRoot(JourneysPage);
        splashScreen.hide();
      } else {
        splashScreen.hide();
      }

      statusBar.styleDefault();
      keyboard.disableScroll(true);
    });
  }

  goToPage(page) {
    this.menu.setRoot(page);
  }

  goToSettings() {
    this.menu.setRoot(SettingsPage);
  }

  public logout() {
    this.events.publish('user:logout');
  }
}
