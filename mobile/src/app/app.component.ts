import { Component, ViewChild } from '@angular/core';
import { Platform, App, LoadingController, Loading, Nav, Events } from 'ionic-angular';

// Plugins
import { Keyboard } from '@ionic-native/keyboard';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

// Pages
import { AboutPage } from '../pages/about/about';
import { HelpPage } from '../pages/help/help';
import { JourneysPage } from '../pages/journeys/journeys';
import { LoginPage } from '../pages/login/login';
import { MapsPage } from '../pages/maps/maps';
import { SettingsPage } from '../pages/settings/settings';

@Component({
  selector: 'page-app',
  templateUrl: 'app.html'
})

export class MyApp {
  
  @ViewChild('menu') menu: Nav;
  loading: Loading;

  public rootPage: any;
  public pages: Array<{ title: string, component: any, icon: string }> = [];
  
  constructor(platform: Platform, app: App, loadingCtrl: LoadingController, public events: Events, keyboard: Keyboard, splashScreen: SplashScreen, statusBar: StatusBar) {

    this.rootPage = LoginPage;
    this.pages.push(
      {title: 'Journeys', component: JourneysPage, icon: 'images'},
      {title: 'Maps', component: MapsPage, icon: 'map'},
      {title: 'About', component: AboutPage, icon: 'information-circle'},
      {title: 'Help', component: HelpPage, icon: 'help-circle'});

    platform.ready().then(() => {

      if((localStorage.getItem('user_logged') == 'true') || (localStorage.getItem('user_logged_fb') == 'true')) {
        app.getActiveNav().setRoot(JourneysPage, {}, {animate: true, direction: 'back'});
        splashScreen.hide();
      } else {
        splashScreen.hide();
      }

      statusBar.styleDefault();
      keyboard.disableScroll(true);
    });
  }

  goToPage(page) {
    this.menu.setRoot(page, {}, {animate: true, direction: 'back'});
  }

  goToSettings() {
    this.menu.setRoot(SettingsPage, {}, {animate: true, direction: 'back'});
  }

  public logout() {
    this.events.publish('user:logout');
  }
}
