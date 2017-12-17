import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { ModalController, AlertController, Events } from 'ionic-angular';

// Plugins
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

// Providers
import { AccountService } from '../../providers/account-service';
import { StorageService } from '../../providers/storage-service';
import { uiComp } from '../../providers/ui-components';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  providers: [AccountService, StorageService]
})

export class SettingsPage {

  public isCheckedImage: boolean = false;
  public isCheckedFb: boolean = false;
  public saveToggleImage = this.storageSvc.get('saveToLibrary');
  public saveToggleFb = this.storageSvc.get('facebook_user_id');
  public isEnabled = null;

  constructor(public modalCtrl: ModalController, public alertCtrl: AlertController, public events: Events, private diagnostic: Diagnostic, private locationAccuracy: LocationAccuracy,
    private accountSvc: AccountService, private storageSvc: StorageService, private uiCmp: uiComp) {

    this.checkedImage();
    this.checkedFb();
    this.enableBtn();
  }

  // MODALS //
  // Open
  public openModal(modalNum) {
    let modal = this.modalCtrl.create('AccountPage', modalNum);
    modal.present();
  }

  // SETTINGS //
  // Save image to photolibrary
  public saveImages() {
    if(this.saveToggleImage === 'true') {
      let image = {
        saveToLibrary: false
      };
      this.accountSvc.updateField(image).subscribe(
        (success) => {
          this.storageSvc.set('saveToLibrary', 'false');
          this.uiCmp.presentToastSuccess('Successfully changed');
        },
        (error) => {
          this.uiCmp.presentToastError('Something went wrong: ' + error);
        }
      );
    } else {
      let image = {
        saveToLibrary: true
      };
      this.accountSvc.updateField(image).subscribe(
        (success) => {
          this.storageSvc.set('saveToLibrary', 'true');
          this.uiCmp.presentToastSuccess('Successfully changed');
        },
        (error) => {
          this.uiCmp.presentToastError('Something went wrong: ' + error);
        }
      );
    }
  }

  // Check options for image
  public checkedImage() {
    this.isCheckedImage = this.saveToggleImage === 'true' ? true : false;
  }

  // Check options for user fb
  public checkedFb() {
    if(this.saveToggleFb !== 'undefined') {
      this.isCheckedFb = true;
    } else {
      this.isCheckedFb = false;
    }
  }

  // Button controls
  public enableBtn() {
    if(this.storageSvc.get('facebook_user_id') !== 'undefined') {
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
    this.accountSvc.deleteAccount().subscribe(
      (success) => {
        this.uiCmp.presentToastSuccess('Your account has been deleted');
        this.logout();
      },
      (error) => {
        this.uiCmp.presentToastError('Something went wrong: ' + error);
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
    ).catch(
      (error) => {
        this.uiCmp.presentToastError('Cordova not available');
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
        this.uiCmp.presentToastError('Something went wrong: ' + error);
      }
    );
  }
}
