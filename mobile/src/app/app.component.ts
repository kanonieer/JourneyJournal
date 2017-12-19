import { Component, ViewChild } from '@angular/core';
import { Platform, IonicApp, Nav, MenuController, Events } from 'ionic-angular';

// Plugins
import { Facebook } from '@ionic-native/facebook';
import { Keyboard } from '@ionic-native/keyboard';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

// Providers
import { AuthService } from '../providers/auth-service';
import { StorageService } from '../providers/storage-service';
import { uiComp } from '../providers/ui-components';

// Shared
import { navOptionsForward, navOptionsBack } from '../shared/GlobalVariables';

@Component({
  selector: 'page-app',
  templateUrl: 'app.html',
  providers: [AuthService, StorageService, uiComp]
})

export class MyApp {
  
  @ViewChild('menu') menu: Nav;
  
  public rootPage: any = 'LoginPage';
  public pages: Array<{ title: string, component: any, icon: string }> = [];
  public lastTimeBackPress = 0;
  public timePeriodToExit  = 3000;
  
  constructor(public platform: Platform, public ionicApp: IonicApp, public menuCtrl: MenuController, public events: Events, private fb: Facebook, private keyboard: Keyboard,
    private locationAccuracy: LocationAccuracy, private splashScreen: SplashScreen, private statusBar: StatusBar, private authSvc: AuthService, private storageSvc: StorageService,
    private uiCmp: uiComp) {

    this.initializeApp();
    this.pages.push(
      {title: 'Journeys', component: 'JourneysPage', icon: 'images'},
      {title: 'About', component: 'AboutPage', icon: 'information-circle'},
      {title: 'Help', component: 'HelpPage', icon: 'help-circle'},
      {title: 'Settings', component: 'SettingsPage', icon: 'settings'}
    );

    events.subscribe('user:logout', () => {
      this.logoutUser();
    });
  }

  // APP //
  // Starting
  public initializeApp() {
    this.platform.ready().then(() => {
      if((this.storageSvc.get('user_logged') === 'true') || (this.storageSvc.get('user_logged_fb') === 'true')) {
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
        let view = this.menu.getActive();
        let currentRootPage = view.component.name;

        if(activePortal) {
          activePortal.dismiss();
        } else if(this.menuCtrl.isOpen()) {
          this.menuCtrl.close();
        } else if(this.menu.canGoBack()) {
          // go to previous page
          this.menu.pop(navOptionsBack);
        } else if(!this.menu.canGoBack()) {
            if((currentRootPage !== 't') && ((this.storageSvc.get('user_logged') === 'true') || (this.storageSvc.get('user_logged_fb') === 'true'))) {
              this.goToPage('JourneysPage');
            } else {
              //Double check to exit app
              if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
                this.platform.exitApp(); //Exit from app
              } else {
                this.uiCmp.presentToast('Press back again to exit');
                this.lastTimeBackPress = new Date().getTime();
              }
            }
          }
        }
      );
    });
  }

  // MENU //
  // Change page
  public goToPage(page) {
    this.menu.setRoot(page, {}, navOptionsForward);
  }

  // Logout
  public logoutUser() {
    if(this.storageSvc.get('user_logged_fb') === "true") {
      this.uiCmp.showLoading();
      this.fb.logout();
      this.storageSvc.clear();
      this.menu.setRoot('LoginPage', {}, navOptionsBack);
      this.uiCmp.loading.dismiss();
    } else if(this.storageSvc.get('user_logged') === "true") {
      this.authSvc.logout().subscribe(
        (data) => {
          this.uiCmp.showLoading();
          this.storageSvc.clear();
          this.menu.setRoot('LoginPage', {}, navOptionsBack);
          this.uiCmp.loading.dismiss();
        }
      );
    }
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
        this.uiCmp.presentToastError('Cordova not available');
      }
    );
  }
}