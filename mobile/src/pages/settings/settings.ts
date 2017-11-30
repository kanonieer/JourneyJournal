import { Component } from '@angular/core';
import { ModalController, AlertController, Events } from 'ionic-angular';

// Pages
import { AccountPage } from '../account/account';

// Providers
import { AccountService } from '../../providers/account-service';
import { StorageService } from '../../providers/storage-service';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  providers: [AccountService, StorageService]
})

export class SettingsPage {

  isCheckedImage: boolean = false;
  isCheckedFb: boolean = false;
  saveToggleImage: string = this.storageSvc.get('save_images');
  saveToggleFb: string = this.storageSvc.get('user_logged_fb');
  isEnabled = null;
  user_id: String = this.storageSvc.get('user_id');

  constructor(public modalCtrl: ModalController, public alertCtrl: AlertController, public events: Events, private accountSvc: AccountService, private storageSvc: StorageService) {

    this.checkedImage();
    this.checkedFb();
    this.enableBtn();
  }

  // MODALS //
  // Open
  openModal(modalNum) {
    let modal = this.modalCtrl.create(AccountPage, modalNum);
    modal.present();
  }

  // SETTINGS //
  // Save image to photolibrary
  saveImages() {
    this.saveToggleImage = this.storageSvc.get('save_images');

    if(this.saveToggleImage === 'true') {
      this.storageSvc.set('save_images', 'false');
    } else {
      this.storageSvc.set('save_images', 'true');
    }
  }

  // Check options for image
  checkedImage() {
    return this.isCheckedImage = this.saveToggleImage === 'true' ? true : false;
  }

  // Check options for user fb
  checkedFb() {
    return this.isCheckedFb = this.saveToggleFb === 'true' ? true : false;
  }

  // Button controls
  enableBtn() {
    if(this.storageSvc.get('email')) {
      this.isEnabled = true;
    }
  }

  // ACCOUNT //
  // Confirm
  public deleteConfirm() {
    const alert = this.alertCtrl.create({
      title: 'Confirm delete',
      message: 'Do you want to delete this account?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteAccount();
          }
        }
      ]
    });
    alert.present();
  }

  // Delete
  public deleteAccount() {
    this.accountSvc.deleteAccount(this.user_id).subscribe(
      (success) => {
        console.log(success);
        this.logout();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  // Logout
  public logout() {
    this.events.publish('user:logout');
  }

  // Add user fb
  addFb() {
    this.events.publish('user:fb')
  }
}
