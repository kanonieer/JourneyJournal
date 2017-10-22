import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  createSuccess = false;
  registerCredentials = {email: '', password: ''};

  constructor(private nav: NavController, private auth: AuthService, private alertCtrl: AlertController) {}

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
  
  public register() {
    this.auth.signUpBasic(this.registerCredentials).subscribe(
      success => {
      if (success) {
        this.createSuccess = true;
          this.showPopup("Success", "Account created");
      } else {
        this.showPopup("Error", "Problem creating account");
      }
    },
    error => {
      this.showPopup("Error", error);
    });
  }

  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
       {
         text: 'OK',
         handler: data => {
           if (this.createSuccess) {
             this.nav.popToRoot();
           }
         }
       }
     ]
    });
    alert.present();
  }
}
