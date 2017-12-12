import { Component } from '@angular/core';
import { ModalController, AlertController, Events } from 'ionic-angular';

// Pages
import { AccountPage } from '../account/account';

// Plugins
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

// Providers
import { AccountService } from '../../providers/account-service';
import { StorageService } from '../../providers/storage-service';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  providers: [AccountService, StorageService]
})

export class SettingsPage {

  public isCheckedImage: boolean = false;
  public isCheckedFb: boolean = false;
  public saveToggleImage: string = this.storageSvc.get('save_images');
  public saveToggleFb: string = this.storageSvc.get('user_logged_fb');
  public isEnabled = null;
  public user_id: String = this.storageSvc.get('user_id');

  constructor(public modalCtrl: ModalController, public alertCtrl: AlertController, public events: Events, private diagnostic: Diagnostic, private locationAccuracy: LocationAccuracy,
    private accountSvc: AccountService, private storageSvc: StorageService) {

    this.checkedImage();
    this.checkedFb();
    this.enableBtn();
  }

  // MODALS //
  // Open
  public openModal(modalNum) {
    let modal = this.modalCtrl.create(AccountPage, modalNum);
    modal.present();
  }

  // SETTINGS //
  // Save image to photolibrary
  public saveImages() {
    this.saveToggleImage = this.storageSvc.get('save_images');

    if(this.saveToggleImage === 'true') {
      this.storageSvc.set('save_images', 'false');
    } else {
      this.storageSvc.set('save_images', 'true');
    }
  }

  // Check options for image
  public checkedImage() {
    return this.isCheckedImage = this.saveToggleImage === 'true' ? true : false;
  }

  // Check options for user fb
  public checkedFb() {
    return this.isCheckedFb = this.saveToggleFb === 'true' ? true : false;
  }

  // Button controls
  public enableBtn() {
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
  public addFb() {
    this.events.publish('user:fb')
  }

  // GPS //
  // Check
  public checkGPS() {
    this.locationAccuracy.canRequest().then(
      (canRequest: boolean) => {
        if(canRequest) {
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            (success) => {
              console.log('Request successful');
            }
          ).catch(
            (error) => {
              alert('To use the full capabilities of our application, we recommend to enable gps');
            }
          );
        }
      }
    );
  }

  // Change
  public changeGPS() {
    this.diagnostic.getLocationMode().then(
      (isEnabled) => {
        if(isEnabled === this.diagnostic.locationMode.LOCATION_OFF) {
          this.checkGPS();
        } else {
          this.diagnostic.switchToLocationSettings();
        }
      }
    ).catch(
      (error) => {
        alert(error);
      }
    );
  }
}
