import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler, } from 'ionic-angular';
import { MyApp } from './app.component';

import { JourneysPage } from '../pages/journeys/journeys';
import { AboutPage } from '../pages/about/about';
import { AddJourneyPage } from '../pages/addJourney/addJourney';
import { DetailsJourneyPage } from '../pages/detailsJourney/detailsJourney';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { MapsPage } from '../pages/maps/maps';
import { SettingsPage } from '../pages/settings/settings';
import { HelpPage } from '../pages/help/help';
import { HowToAddJourneyPage } from '../pages/help/howToAddJourney/howToAddJourney';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeStorage } from '@ionic-native/native-storage';
import { Facebook } from '@ionic-native/facebook';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { Keyboard } from '@ionic-native/keyboard';

import { AuthService } from '../providers/auth-service';
import { JourneyService } from '../providers/journey-service';
import { ImageService } from '../providers/image-service';

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
    SettingsPage,
    HelpPage,
    HowToAddJourneyPage
  ],
  imports: [
    IonicModule.forRoot(MyApp, { scrollAssist: false, autoFocusAssist: false })
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
    SettingsPage,
    HelpPage,
    HowToAddJourneyPage
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
    Keyboard,
    AuthService,
    JourneyService,
    ImageService,
    NativeStorage,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})

export class AppModule {}
