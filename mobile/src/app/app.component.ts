import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Events } from 'ionic-angular';

// Pages
import { AboutPage } from '../pages/about/about';
import { HelpPage } from '../pages/help/help';
import { JourneysPage } from '../pages/journeys/journeys';
import { LoginPage } from '../pages/login/login';
import { MapsPage } from '../pages/maps/maps';
import { SettingsPage } from '../pages/settings/settings';

// Plugins
import { Keyboard } from '@ionic-native/keyboard';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

// Providers
import { StorageService } from '../providers/storage-service';

@Component({
  selector: 'page-app',
  templateUrl: 'app.html',
  providers: [StorageService]
})

export class MyApp {
  
  @ViewChild('menu') menu: Nav;
  
  public rootPage: any = LoginPage;
  public pages: Array<{ title: string, component: any, icon: string }> = [];
  
  constructor(public platform: Platform, public events: Events, private keyboard: Keyboard, private splashScreen: SplashScreen, private statusBar: StatusBar, private storageSvc: StorageService) {
    this.initializeApp();
    this.pages.push(
      {title: 'Journeys', component: JourneysPage, icon: 'images'},
      {title: 'Maps', component: MapsPage, icon: 'map'},
      {title: 'About', component: AboutPage, icon: 'information-circle'},
      {title: 'Help', component: HelpPage, icon: 'help-circle'},
      {title: 'Settings', component: SettingsPage, icon: 'settings'});
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if((this.storageSvc.get('user_logged') == 'true') || (this.storageSvc.get('user_logged_fb') == 'true')) {
        this.menu.setRoot(JourneysPage, {}, {animate: true, direction: 'back'});
        this.splashScreen.hide();
      } else {
        this.splashScreen.hide();
      }
      this.statusBar.styleDefault();
      this.keyboard.disableScroll(true);
    });
  }

  goToPage(page) {
    this.menu.setRoot(page, {}, {animate: true, direction: 'back'});
  }

  public logout() {
    this.events.publish('user:logout');
  }
}