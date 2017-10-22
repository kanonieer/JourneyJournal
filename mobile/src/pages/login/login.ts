import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, Events } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { RegisterPage } from '../register/register';
import { JourneysPage } from '../journeys/journeys';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {
  loading: Loading;
  registerCredentials = {email: '', password: ''};

  constructor(private nav: NavController, private auth: AuthService, private alertCtrl: AlertController, private loadingCtrl: LoadingController,
   private nativeStorage: NativeStorage, private fb: Facebook, public events: Events ) {
     
     events.subscribe('user:logout', () => {
        if (localStorage.getItem('user_logged') == "true") {
          this.logoutUser();
        }
        if (localStorage.getItem('user_logged_fb') == "true") {
          this.logoutFacebook();
        }
     });
   }

  public type = "password";
  public showPass = false;

  showPassword() {
    this.showPass = !this.showPass;
     
    if(this.showPass) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

  public loginFacebook(){

    let permissions = new Array<string>();
    permissions = ['public_profile', 'user_friends', 'email'];
    
    this.showLoading();
    this.fb.login(permissions)
  .then((res: FacebookLoginResponse) =>
  {
    // localStorage.setItem('user_id', data.user_id.toString());
    // localStorage.setItem('token', data.token);
    // localStorage.setItem('public_profile', data.public_profile);
    // localStorage.setItem('user_friends', data.user_friends);
    // localStorage.setItem('email', data.email);
    localStorage.setItem('user_logged_fb', 'true');
    console.log('Logged into Facebook!', res)
    this.nav.setRoot(JourneysPage);
    this.loading.dismiss();
  })
  .catch(error => console.log('Error logging into Facebook', error));
  }
  
  public loginUser(){
  this.showLoading();
  this.auth.loginBasic(this.registerCredentials).subscribe(
      data => {
        localStorage.setItem('user_id', data.user._id.toString());
        localStorage.setItem('token', data.token);
        localStorage.setItem('user_logged', 'true');
        this.nav.setRoot(JourneysPage);
        this.loading.dismiss();
      },
      err => {
        if(err === 'Unauthorized'){
          alert('Błędne dane logowania!');
          this.loading.dismiss();
        }
      });
  }

  createAccount(){
    this.nav.push(RegisterPage);
  }
  
  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  showError(text) {
    setTimeout(() => {
      this.loading.dismiss();
    });

    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }

  public logoutFacebook() {
    this.showLoading();
    this.fb.logout()
    .then((res: FacebookLoginResponse) => {
      localStorage.removeItem('user_logged_fb');
      this.loading.dismiss();
      this.nav.setRoot(LoginPage);
    }).catch(error => console.log('Error logouting into Facebook', error));
  }

  public logoutUser() {
    this.showLoading();
    this.auth.logout().subscribe(
      data => {
        localStorage.removeItem('user_id');
        localStorage.removeItem('token');
        localStorage.removeItem('user_logged');
        this.loading.dismiss();
        this.nav.setRoot(LoginPage);
      });
  }
}
