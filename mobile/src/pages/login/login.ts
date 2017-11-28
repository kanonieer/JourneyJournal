import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, MenuController, ToastController, Events } from 'ionic-angular';

// Pages
import { JourneysPage } from '../journeys/journeys';
import { RegisterPage } from '../register/register';

// Plugins
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

// Providers
import { AuthService } from '../../providers/auth-service';
import { StorageService } from '../../providers/storage-service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {

  ionViewDidLoad() {
    this.menuCtrl.enable(false);
  }
  
  loading: Loading;
  registerCredentials = { email: '', password: '' };
  userData = null;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public menuCtrl: MenuController,
    public toastCtrl: ToastController, public events: Events, private fb: Facebook, private authSvc: AuthService, private storageSvc: StorageService) {
     
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

  public loginFacebook() {

    let permissions = new Array<string>();
    permissions = ['public_profile', 'email'];
    
    this.showLoading();
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
            this.navCtrl.setRoot(JourneysPage, {}, {animate: true, direction: 'back'});
            this.loading.dismiss();
          },
          (err) => {
            alert(err);
            this.loading.dismiss();
          }
        )
      });
    }).catch(error => console.log('Error logging into Facebook', error));
  }
  
  public loginUser() {
    this.showLoading();
    this.authSvc.loginBasic(this.registerCredentials).subscribe(
      (data) => {
        this.storageSvc.set('user_id', data.user._id.toString());
        this.storageSvc.set('token', data.token);
        this.storageSvc.set('user_logged', 'true');
        this.storageSvc.set('save_images', 'false');
        this.navCtrl.setRoot(JourneysPage, {}, {animate: true, direction: 'back'});
        this.loading.dismiss();
      },
      (err) => {
        this.loading.dismiss();
        this.presentToast("Invalid email or password");
      }
    );
  }

  createAccount() {
    this.navCtrl.push(RegisterPage);
  }
  
  showLoading() {
    this.loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Please wait...',
      duration: 2000
    });
    this.loading.present();
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: "bottom",
      cssClass: "error"
    });
    toast.present();
  }

  public logoutFacebook() {
    this.showLoading();
    this.fb.logout();
    this.storageSvc.clear();
    this.navCtrl.setRoot(LoginPage, {}, {animate: true, direction: 'back'});
    this.loading.dismiss();
  }

  public logoutFacebook2() {
    this.showLoading();
    this.fb.logout();
    this.storageSvc.remove('facebook_user_id');
    this.storageSvc.remove('email');
    this.storageSvc.remove('user_logged_fb');
    this.storageSvc.set('user_logged', 'true');
    this.loading.dismiss();
  }

  public logoutUser() {
    this.showLoading();
    this.authSvc.logout().subscribe(
      (data) => {
        this.storageSvc.clear();
        this.navCtrl.setRoot(LoginPage, {}, {animate: true, direction: 'back'});
        this.loading.dismiss();
      }
    );
  }
}
