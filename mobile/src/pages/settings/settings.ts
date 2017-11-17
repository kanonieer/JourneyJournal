import { Component } from '@angular/core';
import { ModalController, Events } from 'ionic-angular';

// Pages
import { AccountPage } from '../account/account';

// Providers
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

  constructor(public modalCtrl: ModalController, public events: Events, private storageSvc: StorageService) {
    this.checkedImage();
    this.checkedFb();
    this.enableBtn();
  }

  openModal(modalNum) {
    
    let modal = this.modalCtrl.create(AccountPage, modalNum);
    modal.present();
  }

  addFb() {
    this.events.publish('user:fb')
  }

  saveImages() {
    this.saveToggleImage = this.storageSvc.get('save_images');

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
}
