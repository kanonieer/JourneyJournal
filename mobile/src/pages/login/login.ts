import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NavController, MenuController } from 'ionic-angular';

// Plugins
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

// Providers
import { AuthService } from '../../providers/auth-service';
import { StorageService } from '../../providers/storage-service';
import { uiComp } from '../../providers/ui-components';

// Shared
import { navOptionsForward } from '../../shared/GlobalVariables';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [AuthService, StorageService, uiComp]
})

export class LoginPage {

  ionViewDidLoad() {
    this.menuCtrl.enable(false);
  }
  
  public userData = null;

  public loginCredentials = {
    email: '', 
    password: '' 
  };

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, private fb: Facebook, private authSvc: AuthService, private storageSvc: StorageService,
    private uiCmp: uiComp) {

  }

  // ACCOUNT //
  // Login-Register FB
  public loginFacebook() {
    let permissions = new Array<string>();
    permissions = ['public_profile', 'email'];
    
    this.uiCmp.showLoading();
    this.fb.login(permissions).then(
      (res: FacebookLoginResponse) => {
        let facebookCredentials = {
          facebook_user_id: res.authResponse.userID,
          facebook_token: res.authResponse.accessToken
        };
        this.authSvc.signUpFacebook(facebookCredentials).subscribe(
          (success) => {
            this.storageSvc.set('user_id', success.data.user_id);
            this.storageSvc.set('facebook_user_id', res.authResponse.userID);
            this.storageSvc.set('token', success.data.access_token);
            if(typeof success.data.local.email === 'undefined') {
              this.storageSvc.set('loginBoth', 'false');
            } else {
              this.storageSvc.set('loginBoth', 'true');
            }
            this.storageSvc.set('user_logged_fb', 'true');
            this.storageSvc.set('saveToLibrary', success.data.saveToLibrary);
            this.storageSvc.set('imageQuality', '50');
            this.navCtrl.setRoot('JourneysPage', {}, navOptionsForward);
            this.uiCmp.loading.dismiss();
          },
          (error) => {
            this.uiCmp.loading.dismiss();
            this.uiCmp.presentToastError('Something went wrong: ' + error);
          }
        );
      }
    ).catch(
      (error) => {
        this.uiCmp.loading.dismiss();
        this.uiCmp.presentToastError('Error logging into Facebook: ' + error);
      }
    );
  }
  
  // Login local
  public loginUser() {
    this.uiCmp.showLoading();
    this.authSvc.loginBasic(this.loginCredentials).subscribe(
      (data) => {
        this.storageSvc.set('user_id', data.user._id.toString());
        if(typeof data.user.facebook === 'undefined') {
          this.storageSvc.set('facebook_user_id', data.user.facebook);
          this.storageSvc.set('loginBoth', 'false');
        } else {
          this.storageSvc.set('facebook_user_id', data.user.facebook.id);
          this.storageSvc.set('loginBoth', 'true');
        }
        this.storageSvc.set('token', data.token);
        this.storageSvc.set('user_logged', 'true');
        this.storageSvc.set('saveToLibrary', data.user.saveToLibrary);
        this.storageSvc.set('imageQuality', '50');
        this.navCtrl.setRoot('JourneysPage', {}, navOptionsForward);
        this.uiCmp.loading.dismiss();
      },
      (error) => {
        this.uiCmp.loading.dismiss();
        this.uiCmp.presentToastError("Invalid email or password");
      }
    );
  }

  // Create
  public createAccount() {
    this.navCtrl.push('RegisterPage', {}, navOptionsForward);
    this.loginCredentials.email = '';
    this.loginCredentials.password = '';
  }
}
