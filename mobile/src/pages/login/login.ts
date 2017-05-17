import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { RegisterPage } from '../register/register';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  loading: Loading;
  registerCredentials = {email: '', password: ''};

  constructor(private nav: NavController, private auth: AuthService, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {}

  public createAccount() {
    this.nav.push(RegisterPage);
  }

  public loginUser(){
  this.showLoading();
  this.auth.loginBasic(this.registerCredentials).subscribe(
      data => {
        localStorage.setItem('user_id', data.user._id.toString());
        localStorage.setItem('token', data.token);
        localStorage.setItem('user_logged', 'true');
        this.loading.dismiss();
        this.nav.setRoot(TabsPage);
      },
      err => {
        if(err === 'Unauthorized'){
          alert('Błędne dane logowania!');
          this.loading.dismiss();
        }
      }
    );
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
}
