import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavParams, ViewController, ToastController, Events } from 'ionic-angular';

// Providers
import { AccountService } from '../../providers/account-service';
import { AuthService } from '../../providers/auth-service';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})

export class AccountPage {
  modal;
  createForm = false;
  emailForm = false;
  passwordForm = false;

  registerCredentials = {
    email: '',
    password: ''
  };

  emailCredentials = {
    oldEmail: '',
    newEmail: ''
  };

  passwordCredentials = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  constructor(public params: NavParams, public viewCtrl: ViewController, private toastCtrl: ToastController, public events: Events, private accountSvc: AccountService, private authSvc: AuthService) {
    this.startModal();
    this.checkedModal();
  }

  createAccount(form: NgForm) {
    this.authSvc.signUpBasic(form).subscribe(
      (success) => {
        if (success) {
          this.dismiss();
          this.presentToastSuccess('Account created');
        } else {
          this.presentToastError('Problem creating account');
        }
      },
      (error) => {
        this.presentToastError('Error');
      }
    );
  }

  changeEmail(form: NgForm) {
    this.accountSvc.changeEmail(form.value).subscribe(
      (data) => {
        this.dismiss();
        this.presentToastSuccess(data.message);
      },
      (error) => {
        if (error.code === undefined) {
          this.presentToastError(error.message);
        }
        if (error.code === 401.1) {
          this.presentToastError(error.message);
        }
        if (error.code === 401.2) {
          this.presentToastError(error.message);
        }
        if (error.code === 401.3) {
          this.presentToastError(error.message);
        }
      }
    );
  }

  changePassword(form: NgForm) {
    var payload = {
        oldPassword: form.value.oldPassword,
        newPassword: form.value.newPassword
    };

    if(form.value.oldPassword === form.value.newPassword) {
      this.presentToastError('New password is the same as old one');
    } else if(form.value.newPassword === form.value.confirmPassword) {
        this.accountSvc.changePassword(payload).subscribe(
            (data) => {
                this.logout();
                this.dismiss();
                this.presentToastSuccess(data.message);
            },
            (error) => {
                if (error.code === undefined) {
                    this.presentToastError(error.message);
                }
                if (error.code === 401.1) {
                    this.presentToastError(error.message);
                }
            }
        );
    } else {
        this.presentToastError('New password is not the same as confirm');
    }
  }

  public logout() {
    this.events.publish('user:logout');
  }

  startModal() {
    var modals = [{
        name: 'Create an account',
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

  checkedModal() {
    if (this.modal.form === 'Create') {
      this.createForm = true;
    } else if (this.modal.form === 'Email') {
      this.emailForm = true;
    } else {
      this.passwordForm = true;
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  private presentToastSuccess(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 1500,
      position: "bottom",
      cssClass: "success"
    });
    toast.present();
  }

  private presentToastError(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 1500,
      position: "bottom",
      cssClass: "error"
    });
    toast.present();
  }
}
