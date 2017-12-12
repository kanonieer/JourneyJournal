import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

// Plugins
import { Camera } from '@ionic-native/camera';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Facebook } from '@ionic-native/facebook';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Geolocation } from '@ionic-native/geolocation';
import { ImagePicker } from '@ionic-native/image-picker';
import { Keyboard } from '@ionic-native/keyboard';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

// Providers
import { AccountService } from '../providers/account-service';
import { AuthService } from '../providers/auth-service';
import { ImageService } from '../providers/image-service';
import { JourneyService } from '../providers/journey-service';
import { StorageService } from '../providers/storage-service';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, { scrollAssist: false, autoFocusAssist: false })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    Camera,
    Diagnostic,
    Facebook,
    FileTransfer,
    Geolocation,
    ImagePicker,
    Keyboard,
    LocationAccuracy,
    SplashScreen,
    StatusBar,
    AccountService,
    AuthService,
    ImageService,
    JourneyService,
    StorageService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})

export class AppModule {}
