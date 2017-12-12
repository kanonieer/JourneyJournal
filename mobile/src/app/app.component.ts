import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Events, ToastController } from 'ionic-angular';

// Pages
import { AboutPage } from '../pages/about/about';
import { HelpPage } from '../pages/help/help';
import { JourneysPage } from '../pages/journeys/journeys';
import { LoginPage } from '../pages/login/login';
import { SettingsPage } from '../pages/settings/settings';

// Plugins
import { LocationAccuracy } from '@ionic-native/location-accuracy';
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
  public lastTimeBackPress = 0;
  public timePeriodToExit  = 2000;

  public navOptions = {
    animate: true,
    animation: 'transition',
    duration: 600,
    direction: 'forward'
  };
  public navOptionsBack = {
    animate: true,
    animation: 'transition',
    duration: 600,
    direction: 'back'
  };
  
  constructor(public platform: Platform, public events: Events, public toastCtrl: ToastController, private locationAccuracy: LocationAccuracy,
    private keyboard: Keyboard, private splashScreen: SplashScreen, private statusBar: StatusBar, private storageSvc: StorageService) {

    this.initializeApp();
    this.checkGPS();
    this.pages.push(
      {title: 'Journeys', component: JourneysPage, icon: 'images'},
      {title: 'About', component: AboutPage, icon: 'information-circle'},
      {title: 'Help', component: HelpPage, icon: 'help-circle'},
      {title: 'Settings', component: SettingsPage, icon: 'settings'});
  }

  // APP //
  // Starting
  public initializeApp() {
    this.platform.ready().then(() => {
      if((this.storageSvc.get('user_logged') == 'true') || (this.storageSvc.get('user_logged_fb') == 'true')) {
        this.menu.setRoot(JourneysPage, {}, this.navOptions);
        this.splashScreen.hide();
      } else {
        this.splashScreen.hide();
      }
      this.statusBar.styleDefault();
      this.keyboard.disableScroll(true);

      this.platform.registerBackButtonAction(() => {
        if (!this.menu.canGoBack()) {
          //Double check to exit app
          if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
            this.platform.exitApp(); //Exit from app
          } else {
            this.presentToast('Press back again to exit');
            this.lastTimeBackPress = new Date().getTime();
            }
        } else {
          // go to previous page
          this.menu.pop(this.navOptionsBack);
        }
      });
    });
  }

  // MENU //
  // Change page
  public goToPage(page) {
    this.menu.setRoot(page, {}, this.navOptions);
  }

  // Logout
  public logout() {
    this.events.publish('user:logout');
  }

  // TOASTS//
  // Present
  public presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: "bottom"
    });
    toast.present();
  }

  // GPS //
  // Check
  public checkGPS() {
    this.locationAccuracy.canRequest().then(
      (canRequest: boolean) => {
        if(canRequest) {
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            (success) => {
              console.log('Request successful');
            }
          ).catch(
            (error) => {
              alert('To use the full capabilities of our application, we recommend to enable gps');
            }
          );
        }
      }
    );
  }
}