import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NavController, MenuController } from 'ionic-angular';

// Providers
import { AuthService } from '../../providers/auth-service';
import { uiComp } from '../../providers/ui-components';

// Shared
import { navOptionsBack } from '../../shared/GlobalVariables';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
  providers: [AuthService, uiComp]
})

export class RegisterPage {

  ionViewDidLoad() {
    this.menuCtrl.enable(false);
  }

  public registerCredentials = {
    email: '',
    password: ''
  };

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, private authSvc: AuthService, private uiCmp: uiComp) {
  }

  // ACCOUNT //
  // Register
  public register() {
    this.authSvc.signUpBasic(this.registerCredentials).subscribe(
      (success) => {
        this.navCtrl.pop(navOptionsBack);
        this.uiCmp.presentToastSuccess('Account created');
      },
      (error) => {
        this.uiCmp.presentToastError(error);
      }
    );
  }

  // NAV //
  // Back to login
  public signIn() {
    this.navCtrl.pop(navOptionsBack);
    this.registerCredentials.email = '';
    this.registerCredentials.password = '';
  }
}
