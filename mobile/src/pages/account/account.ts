import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { NavParams, ViewController, Events } from 'ionic-angular';

// Providers
import { AccountService } from '../../providers/account-service';
import { AuthService } from '../../providers/auth-service';
import { uiComp } from '../../providers/ui-components';

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
  providers: [AccountService, AuthService, uiComp]
})

export class AccountPage {

  public modal;
  public createForm = false;
  public emailForm = false;
  public passwordForm = false;

  public registerCredentials = {
    email: '',
    password: ''
  };
  public emailCredentials = {
    oldEmail: '',
    newEmail: ''
  };
  public passwordCredentials = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  constructor(public params: NavParams, public viewCtrl: ViewController, public events: Events, private accountSvc: AccountService, private authSvc: AuthService,
    private uiCmp: uiComp) {

    this.startModal();
    this.checkModal();
  }

  // ACCOUNT //
  // Create
  public createAccount(form: NgForm) {
    this.authSvc.signUpBasic(form).subscribe(
      (success) => {
        if (success) {
          this.dismiss();
          this.uiCmp.presentToastSuccess('Account created');
        } else {
          this.uiCmp.presentToastError('Problem creating an account');
        }
      },
      (error) => {
        this.uiCmp.presentToastError(error);
      }
    );
  }

  // Email
  public changeEmail(form: NgForm) {
    this.accountSvc.changeEmail(form.value).subscribe(
      (data) => {
        this.dismiss();
        this.uiCmp.presentToastSuccess(data.message);
      },
      (error) => {
        if (error.code === undefined) {
          this.uiCmp.presentToastError(error.message);
        }
        if (error.code === 401.1) {
          this.uiCmp.presentToastError(error.message);
        }
        if (error.code === 401.2) {
          this.uiCmp.presentToastError(error.message);
        }
        if (error.code === 401.3) {
          this.uiCmp.presentToastError(error.message);
        }
      }
    );
  }

  // Password
  public changePassword(form: NgForm) {
    var payload = {
        oldPassword: form.value.oldPassword,
        newPassword: form.value.newPassword
    };
    
    if(form.value.oldPassword === form.value.newPassword) {
      this.uiCmp.presentToastError('New password is the same as old one');
    } else if(form.value.newPassword === form.value.confirmPassword) {
        this.accountSvc.changePassword(payload).subscribe(
            (data) => {
                this.logout();
                this.dismiss();
                this.uiCmp.presentToastSuccess(data.message);
            },
            (error) => {
                if (error.code === undefined) {
                    this.uiCmp.presentToastError(error.message);
                }
                if (error.code === 401.1) {
                    this.uiCmp.presentToastError(error.message);
                }
            }
        );
    } else {
        this.uiCmp.presentToastError('New password is not the same as confirm');
    }
  }

  // Logout
  public logout() {
    this.events.publish('user:logout');
  }

  // MODALS //
  // Start
  public startModal() {
    var modals = [{
        name: 'Create new account',
        form: 'Create'
      },
      {
        name: 'Change email',
        form: 'Email'
      },
      {
        name: 'Change password',
        form: 'Password'
      }
    ];
    this.modal = modals[this.params.get('modalNum')];
  }

  // Check
  public checkModal() {
    if (this.modal.form === 'Create') {
      this.createForm = true;
    } else if (this.modal.form === 'Email') {
      this.emailForm = true;
    } else {
      this.passwordForm = true;
    }
  }

  // Dissmiss
  public dismiss() {
    this.viewCtrl.dismiss();
  }
}
