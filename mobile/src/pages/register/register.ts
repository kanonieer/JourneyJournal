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

  public createSuccess = false;

  public registerCredentials = {
    email: '',
    password: ''
  };
  public navOptions = {
    animate: true, 
    animation: 'transition', 
    duration: 600, 
    direction: 'back'
  };

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, private alertCtrl: AlertController, private authSvc: AuthService) {
  }

  // ACCOUNT //
  // Register
  public register() {
    this.authSvc.signUpBasic(this.registerCredentials).subscribe(
      (success) => {
        if (success) {
          this.createSuccess = true;
          this.showPopup("Success", "Account created");
        } else {
          this.showPopup("Error", "Problem creating an account");
        }
      },
      (error) => {
        this.showPopup("Error", error);
      });
  }

  // NAV //
  // Back to login
  public signIn() {
    this.navCtrl.pop(this.navOptions);
    this.registerCredentials.email = '';
    this.registerCredentials.password = '';
  }

  // ALERT //
  // Show
  public showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [{
        text: 'OK',
        handler: (data) => {
          if (this.createSuccess) {
            this.navCtrl.pop(this.navOptions);
          }
        }
      }]
    });
    alert.present();
  }
}
