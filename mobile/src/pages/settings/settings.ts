import { Component } from '@angular/core';
import { AlertController, ToastController } from 'ionic-angular';

// Providers
import { AccountService } from '../../providers/account-service';
import { StorageService } from '../../providers/storage-service';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})

export class SettingsPage {

  isCheckedImage: boolean = false;
  isCheckedFb: boolean = false;
  saveToggleImage: string = this.storageSvc.get('save_images');
  saveToggleFb: string = this.storageSvc.get('user_logged_fb');
  isEnabled = null;

  constructor(private alertCtrl: AlertController, private toastCtrl: ToastController, private accountSvc: AccountService, private storageSvc: StorageService) {
    this.checkedImage();
    this.checkedFb();
    this.enableBtn();
  }

  changeEmail() {
    let alert = this.alertCtrl.create({
      title: 'Change email',
      inputs: [
        {
          type: 'text',
          placeholder: 'Old email',
          name: 'oldEmail'
        },
        {
          type: 'text',
          placeholder: 'New email',
          name: 'newEmail'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Change',
          handler: form => {

            if((form.oldEmail === '') && (form.newEmail === '')) {
              this.presentToastError('You did not enter anything');
            } else if(form.newEmail === '') {
              this.presentToastError('New email was empty');
            } else if(form.oldEmail === '') {
              this.presentToastError('Old email was empty');
            } else {
              this.accountSvc.changeEmail(form).subscribe(
                (data) => {
                  this.presentToastSuccess('Email changed');
                },
                (error) => {
                  if (error.code == undefined) {
                    this.presentToastError('Invalid old email');
                  }
                  if (error.code == 401.1) {
                    console.log('Nie dodałeś jeszcze opcji logowania przez email');
                  }
                  if (error.code == 401.2) {
                    console.log('Stary email jest nie prawidłowy');
                  }
                  if (error.code == 401.3) {
                    console.log('Email jest już zajęty');
                  }
              });
            }
          }
        }
      ]
    });
    alert.present();
  }

  changePassword() {
    let alert = this.alertCtrl.create({
      title: 'Change password',
      inputs: [
        {
          type: 'password',
          placeholder: 'Old password',
          name: 'oldPassword'
        },
        {
          type: 'password',
          placeholder: 'New password',
          name: 'newPassword'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Change',
          handler: form => {

            if((form.oldPassword === '') && (form.newPassword === '')) {
              this.presentToastErrorPass('You did not enter anything');
            } else if(form.newPassword === '') {
              this.presentToastErrorPass('New password was empty');
            } else if(form.oldPassword === '') {
              this.presentToastErrorPass('Old password was empty');
            } else {
              this.accountSvc.changePassword(form).subscribe(
                (data) => {
                  this.presentToastSuccess('Password changed');
                },
                (error) => {
                  if (error.code == undefined) {
                    this.presentToastErrorPass('Invalid old password');
                  }
              });
            }
          }
        }
      ]
    });
    alert.present();
  }

  saveImages() {
    if(this.saveToggleImage === 'true') {
      this.storageSvc.set('save_images', 'false');
    } else {
      this.storageSvc.set('save_images', 'true');
    }
  }

  checkedImage() {
    return this.isCheckedImage = this.saveToggleImage === 'true' ? true : false;
  }

  checkedFb() {
    return this.isCheckedFb = this.saveToggleFb === 'true' ? true : false;
  }

  enableBtn() {
    if(this.storageSvc.get('email')) {
      this.isEnabled = true;
    }
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

    toast.onDidDismiss(() => {
      this.changeEmail();
    });

    toast.present();
  }

  private presentToastErrorPass(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 1500,
      position: "bottom",
      cssClass: "error"
    });

    toast.onDidDismiss(() => {
      this.changePassword();
    });

    toast.present();
  }
}
