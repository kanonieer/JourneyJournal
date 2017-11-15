import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

// Pages
import { AboutPage } from '../pages/about/about';
import { AddJourneyPage } from '../pages/addJourney/addJourney';
import { DetailsJourneyPage } from '../pages/detailsJourney/detailsJourney';
import { HelpPage } from '../pages/help/help';
import { HowToAddJourneyPage } from '../pages/help/howToAddJourney/howToAddJourney';
import { JourneysPage } from '../pages/journeys/journeys';
import { LoginPage } from '../pages/login/login';
import { MapsPage } from '../pages/maps/maps';
import { RegisterPage } from '../pages/register/register';
import { SettingsPage } from '../pages/settings/settings';

// Plugins
import { Camera } from '@ionic-native/camera';
import { Facebook } from '@ionic-native/facebook';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { Geolocation } from '@ionic-native/geolocation';
import { Keyboard } from '@ionic-native/keyboard';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

// Providers
import { AuthService } from '../providers/auth-service';
import { ImageService } from '../providers/image-service';
import { JourneyService } from '../providers/journey-service';
import { StorageService } from '../providers/storage-service';
import { UserService } from '../providers/user-service';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    AddJourneyPage,
    DetailsJourneyPage,
    HelpPage,
    HowToAddJourneyPage,
    JourneysPage,
    LoginPage,
    MapsPage,
    RegisterPage,
    SettingsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp, { scrollAssist: false, autoFocusAssist: false })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    AddJourneyPage,
    DetailsJourneyPage,
    HelpPage,
    HowToAddJourneyPage,
    JourneysPage,
    LoginPage,
    MapsPage,
    RegisterPage,
    SettingsPage
  ],
  providers: [
    Camera,
    Facebook,
    File,
    FileTransfer,
    FilePath,
    Geolocation,
    Keyboard,
    SplashScreen,
    StatusBar,
    AuthService,
    ImageService,
    JourneyService,
    StorageService,
    UserService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})

export class AppModule {}
