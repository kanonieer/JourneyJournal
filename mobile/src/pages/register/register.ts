import { Component } from '@angular/core';
import { NavController, AlertController, MenuController } from 'ionic-angular';

// Providers
import { AuthService } from '../../providers/auth-service';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
  providers: [AuthService]
})

export class RegisterPage {

  ionViewDidLoad() {
    this.menuCtrl.enable(false);
  }

  createSuccess = false;
  registerCredentials = {
    email: '',
    password: ''
  };

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, private alertCtrl: AlertController, private authSvc: AuthService) {
  }

  public register() {
    this.authSvc.signUpBasic(this.registerCredentials).subscribe(
      (success) => {
        if (success) {
          this.createSuccess = true;
          this.showPopup("Success", "Account created");
        } else {
          this.showPopup("Error", "Problem creating account");
        }
      },
      (error) => {
        this.showPopup("Error", error);
      });
  }

  signIn() {
    this.navCtrl.pop();
  }

  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [{
        text: 'OK',
        handler: (data) => {
          if (this.createSuccess) {
            this.navCtrl.popToRoot();
          }
        }
      }]
    });
    alert.present();
  }
}
