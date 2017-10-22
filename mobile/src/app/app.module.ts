import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler, } from 'ionic-angular';
import { AuthService } from '../providers/auth-service';
import { MyApp } from './app.component';
// import { CloudinaryModule } from '@cloudinary/angular-4.x';
// import * as  Cloudinary from 'cloudinary-core';

import { JourneysPage } from '../pages/journeys/journeys';
import { AboutPage } from '../pages/about/about';
import { AddJourneyPage } from '../pages/addJourney/addJourney';
import { DetailsJourneyPage } from '../pages/detailsJourney/detailsJourney';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { MapsPage } from '../pages/maps/maps';
import { SettingsPage } from '../pages/settings/settings';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeStorage } from '@ionic-native/native-storage';
import { Facebook } from '@ionic-native/facebook';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';

@NgModule({
  declarations: [
    MyApp,
    JourneysPage,
    AddJourneyPage,
    DetailsJourneyPage,
    LoginPage,
    RegisterPage,
    AboutPage,
    MapsPage,
    SettingsPage
  ],
  imports: [
    //CloudinaryModule.forRoot(Cloudinary, { cloud_name: 'dzgtgeotp'}),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    JourneysPage,
    AddJourneyPage,
    DetailsJourneyPage,
    LoginPage,
    RegisterPage,
    AboutPage,
    MapsPage,
    SettingsPage
  ],
  providers: [
    Facebook,
    StatusBar,
    SplashScreen,
    File,
    FileTransfer,
    Camera,
    FilePath,
    Geolocation,
    AuthService,
    NativeStorage,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
