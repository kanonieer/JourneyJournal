import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NavController, MenuController, Events } from 'ionic-angular';

// Plugins
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

// Providers
import { AuthService } from '../../providers/auth-service';
import { StorageService } from '../../providers/storage-service';
import { uiComp } from '../../providers/ui-components';

// Shared
import { navOptionsForward, navOptionsBack } from '../../shared/GlobalVariables';

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

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, public events: Events, private fb: Facebook, private authSvc: AuthService,
    private storageSvc: StorageService, private uiCmp: uiComp) {
     
    events.subscribe('user:logout', () => {
      if(this.storageSvc.get('user_logged') === "true") {
        this.logoutUser();
      }
      if(this.storageSvc.get('user_logged_fb') === "true") {
        this.logoutFacebook();
      }
    });

    events.subscribe('user:fb', () => {
      if(this.storageSvc.get('email')) {
        this.logoutFacebook2();
      } else {
        this.loginFacebook();
      }
    });
  }

  // ACCOUNT //
  // Login FB
  public loginFacebook() {

    let permissions = new Array<string>();
    permissions = ['public_profile', 'email'];
    
    this.uiCmp.showLoading();
    this.fb.login(permissions).then((res: FacebookLoginResponse) => {
      this.fb.api('me?fields=id,email', []).then(profile => {
        this.userData = {email: profile['email']};

        let facebookCredentials = {
          user_id: this.storageSvc.get('user_id'),
          facebook_user_id: res.authResponse.userID,
          token: res.authResponse.accessToken
        };

        this.authSvc.signUpFacebook(facebookCredentials).subscribe(
          (success) => {
            this.storageSvc.set('facebook_user_id', res.authResponse.userID);
            this.storageSvc.set('user_id', success.data.payload_user_id);
            this.storageSvc.set('token', success.data.access_token);
            this.storageSvc.set('email', this.userData.email);
            this.storageSvc.set('user_logged_fb', 'true');
            this.storageSvc.set('save_images', 'false');
            this.navCtrl.setRoot('JourneysPage', {}, navOptionsForward);
            this.uiCmp.loading.dismiss();
          },
          (err) => {
            alert(err);
            this.uiCmp.loading.dismiss();
          }
        )
      });
    }).catch(error => console.log('Error logging into Facebook', error));
  }
  
  // Login local
  public loginUser() {
    this.uiCmp.showLoading();
    this.authSvc.loginBasic(this.loginCredentials).subscribe(
      (data) => {
        this.storageSvc.set('user_id', data.user._id.toString());
        this.storageSvc.set('token', data.token);
        this.storageSvc.set('user_logged', 'true');
        this.storageSvc.set('save_images', 'false');
        this.navCtrl.setRoot('JourneysPage', {}, navOptionsForward);
        this.uiCmp.loading.dismiss();
      },
      (err) => {
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

  // Logout FB
  public logoutFacebook() {
    this.uiCmp.showLoading();
    this.fb.logout();
    this.storageSvc.clear();
    this.navCtrl.setRoot(LoginPage, {}, navOptionsBack);
    this.uiCmp.loading.dismiss();
  }

  // Logout FB test
  public logoutFacebook2() {
    this.uiCmp.showLoading();
    this.fb.logout();
    this.storageSvc.remove('facebook_user_id');
    this.storageSvc.remove('email');
    this.storageSvc.remove('user_logged_fb');
    this.storageSvc.set('user_logged', 'true');
    this.uiCmp.loading.dismiss();
  }

  // Logout local
  public logoutUser() {
    this.uiCmp.showLoading();
    this.authSvc.logout().subscribe(
      (data) => {
        this.storageSvc.clear();
        this.navCtrl.setRoot(LoginPage, {}, navOptionsBack);
        this.uiCmp.loading.dismiss();
      }
    );
  }
}
