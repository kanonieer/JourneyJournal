import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, Events, MenuController, ToastController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { NativeStorage } from '@ionic-native/native-storage';

import { RegisterPage } from '../register/register';
import { JourneysPage } from '../journeys/journeys';

import { AuthService } from '../../providers/auth-service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {

  ionViewDidLoad() {
    this.menuCtrl.enable(false);
  }
  
  loading: Loading;
  registerCredentials = {email: '', password: ''};
  userData = null;

  constructor(public navCtrl: NavController, private authSvc: AuthService, private alertCtrl: AlertController, public loadingCtrl: LoadingController, public menuCtrl: MenuController,
   private nativeStorage: NativeStorage, private fb: Facebook, public events: Events, public toastCtrl: ToastController) {
     
     events.subscribe('user:logout', () => {
        if (localStorage.getItem('user_logged') == "true") {
          this.logoutUser();
        }
        if (localStorage.getItem('user_logged_fb') == "true") {
          this.logoutFacebook();
        }
     });
    }

  public loginFacebook(){

    let permissions = new Array<string>();
    permissions = ['public_profile', 'email'];
    
    this.showLoading();
    this.fb.login(permissions).then((res: FacebookLoginResponse) => {
      this.fb.api('me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)', []).then(profile => {
        this.userData = {email: profile['email'], first_name: profile['first_name'], picture: profile['picture_large']['data']['url'], username: profile['name']};
        localStorage.setItem('user_id', res.authResponse.userID);
        alert(localStorage.getItem('user_id'));
        localStorage.setItem('token', res.authResponse.accessToken);
        alert(localStorage.getItem('token'));
        localStorage.setItem('email', this.userData.email);
        alert(localStorage.getItem('email'));
        localStorage.setItem('name', this.userData.first_name);
        alert(localStorage.getItem('name'));
        localStorage.setItem('user_logged_fb', 'true');
      })
      this.navCtrl.setRoot(JourneysPage);
      this.loading.dismiss();
    }).catch(error => console.log('Error logging into Facebook', error));
  }
  
  public loginUser(){
  this.showLoading();
  this.authSvc.loginBasic(this.registerCredentials).subscribe(
      data => {
        localStorage.setItem('user_id', data.user._id.toString());
        localStorage.setItem('token', data.token);
        localStorage.setItem('user_logged', 'true');
        this.navCtrl.setRoot(JourneysPage);
        this.loading.dismiss();
      },
      err => {
        if(err === 'Unauthorized'){
          this.loading.dismiss();
          this.presentToast("Invalid email or password");
        }
      });
  }

  createAccount(){
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
    localStorage.removeItem('user_id');
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    localStorage.removeItem('user_logged_fb');
    this.navCtrl.setRoot(LoginPage);
    this.loading.dismiss();
  }

  public logoutUser() {
    this.showLoading();
    this.authSvc.logout().subscribe(
      data => {
        localStorage.removeItem('user_id');
        localStorage.removeItem('token');
        localStorage.removeItem('user_logged');
        this.navCtrl.setRoot(LoginPage);
        this.loading.dismiss();
      });
  }
}
