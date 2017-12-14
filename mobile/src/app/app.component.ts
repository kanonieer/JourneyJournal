import { Component, ViewChild } from '@angular/core';
import { Platform, IonicApp, Nav, Events, MenuController } from 'ionic-angular';

// Plugins
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Keyboard } from '@ionic-native/keyboard';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

// Providers
import { StorageService } from '../providers/storage-service';
import { uiComp } from '../providers/ui-components';

// Shared
import { navOptionsForward, navOptionsBack } from '../shared/GlobalVariables';

@Component({
  selector: 'page-app',
  templateUrl: 'app.html',
  providers: [StorageService, uiComp]
})

export class MyApp {
  
  @ViewChild('menu') menu: Nav;
  
  public rootPage: any = 'LoginPage';
  public pages: Array<{ title: string, component: any, icon: string }> = [];
  public lastTimeBackPress = 0;
  public timePeriodToExit  = 2000;
  
  constructor(public platform: Platform, public ionicApp: IonicApp, public events: Events, public menuCtrl: MenuController, private locationAccuracy: LocationAccuracy,
    private keyboard: Keyboard, private splashScreen: SplashScreen, private statusBar: StatusBar, private storageSvc: StorageService, private uiCmp: uiComp) {

    this.initializeApp();
    this.pages.push(
      {title: 'Journeys', component: 'JourneysPage', icon: 'images'},
      {title: 'About', component: 'AboutPage', icon: 'information-circle'},
      {title: 'Help', component: 'HelpPage', icon: 'help-circle'},
      {title: 'Settings', component: 'SettingsPage', icon: 'settings'});
  }

  // APP //
  // Starting
  public initializeApp() {
    this.platform.ready().then(() => {
      if((this.storageSvc.get('user_logged') == 'true') || (this.storageSvc.get('user_logged_fb') == 'true')) {
        this.menu.setRoot('JourneysPage', {}, navOptionsForward);
        this.checkGPS();
        this.splashScreen.hide();
      } else {
        this.checkGPS();
        this.splashScreen.hide();
      }
      this.statusBar.styleDefault();
      this.keyboard.disableScroll(true);

      this.platform.registerBackButtonAction(() => {
        let activePortal = this.ionicApp._loadingPortal.getActive() || this.ionicApp._modalPortal.getActive() || this.ionicApp._overlayPortal.getActive();
        
        if(activePortal) {
          activePortal.dismiss();
        } else if(this.menuCtrl.isOpen()) {
          this.menuCtrl.close();
        } else if(!this.menu.canGoBack()) {
          //Double check to exit app
          if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
            this.platform.exitApp(); //Exit from app
          } else {
            this.uiCmp.presentToast('Press back again to exit');
            this.lastTimeBackPress = new Date().getTime();
            }
        } else {
          // go to previous page
          this.menu.pop(navOptionsBack);
        }
      });
    });
  }

  // MENU //
  // Change page
  public goToPage(page) {
    this.menu.setRoot(page, {}, navOptionsForward);
  }

  // Logout
  public logout() {
    this.events.publish('user:logout');
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
    ).catch(
      (error) => {
        console.log('Cordova not available');
      }
    );
  }
}