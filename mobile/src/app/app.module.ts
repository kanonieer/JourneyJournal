import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { AuthService } from '../providers/auth-service';
import { MyApp } from './app.component';
import { TravelsPage } from '../pages/travels/travels';
import { TabsPage } from '../pages/tabs/tabs';
import { SettingsPage } from '../pages/settings/settings';
import { AboutPage } from '../pages/about/about';
import { AddTravelPage } from '../pages/addTravel/addTravel';
import { DetailsTravelPage } from '../pages/detailsTravel/detailsTravel';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    TravelsPage,
    AddTravelPage,
    DetailsTravelPage,
    LoginPage,
    RegisterPage,
    AboutPage,
    TabsPage,
    SettingsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TravelsPage,
    AddTravelPage,
    DetailsTravelPage,
    LoginPage,
    RegisterPage,
    AboutPage,
    TabsPage,
    SettingsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
