import { Component } from '@angular/core';
import { Platform, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeStorage } from '@ionic-native/native-storage';

import { LoginPage } from '../pages/login/login';
import { TravelsPage } from '../pages/travels/travels';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = LoginPage;

  constructor(platform: Platform, nativeStorage: NativeStorage, statusBar: StatusBar, splashScreen: SplashScreen, app: App) {
    platform.ready().then(() => {
      if(localStorage.getItem('user_logged') == 'true') {
        app.getActiveNav().setRoot(TravelsPage);
      }
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
