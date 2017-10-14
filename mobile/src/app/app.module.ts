import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler, } from 'ionic-angular';
import { AuthService } from '../providers/auth-service';
import { MyApp } from './app.component';
// import { CloudinaryModule } from '@cloudinary/angular-4.x';
// import * as  Cloudinary from 'cloudinary-core';

import { TravelsPage } from '../pages/travels/travels';
import { AboutPage } from '../pages/about/about';
import { AddTravelPage } from '../pages/addTravel/addTravel';
import { DetailsTravelPage } from '../pages/detailsTravel/detailsTravel';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeStorage } from '@ionic-native/native-storage';
import { Facebook } from '@ionic-native/facebook';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

@NgModule({
  declarations: [
    MyApp,
    TravelsPage,
    AddTravelPage,
    DetailsTravelPage,
    LoginPage,
    RegisterPage,
    AboutPage
  ],
  imports: [
    //CloudinaryModule.forRoot(Cloudinary, { cloud_name: 'dzgtgeotp'}),
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
    AboutPage
  ],
  providers: [
    Facebook,
    StatusBar,
    SplashScreen,
    File,
    FileTransfer,
    Camera,
    FilePath,
    AuthService,
    NativeStorage,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
