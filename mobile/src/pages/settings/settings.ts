import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { ModalController, AlertController, ViewController, Events, NavParams } from 'ionic-angular';

// Plugins
import { Diagnostic } from '@ionic-native/diagnostic';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

// Providers
import { AccountService } from '../../providers/account-service';
import { AuthService } from '../../providers/auth-service';
import { StorageService } from '../../providers/storage-service';
import { uiComp } from '../../providers/ui-components';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  providers: [AccountService, AuthService, StorageService, uiComp]
})

export class SettingsPage {

  public isCheckedImage: boolean = false;
  public isCheckedFb: boolean = false;
  public isShow = false;
  public imageQuality = 100;
  public isEnabled = true;
  public modal;

  constructor(public modalCtrl: ModalController, public alertCtrl: AlertController, public viewCtrl: ViewController, public events: Events, public params: NavParams,
    private diagnostic: Diagnostic, private fb: Facebook, private locationAccuracy: LocationAccuracy, private accountSvc: AccountService, private authSvc: AuthService,
    private storageSvc: StorageService, private uiCmp: uiComp) {

    this.checkAll();
    this.startModal();

    events.subscribe('user:settings', () => {
      this.checkAll();
    });
  }

  // MODALS //
  // Open
  public openModal(modalNum) {
    let modal = this.modalCtrl.create('AccountPage', modalNum);
    modal.present();
  }

  // Start
  public startModal() {
    this.modal = this.params.get('modal');
  }

  // Dissmiss
  public dismiss() {
    this.viewCtrl.dismiss();
  }

  // SETTINGS //
  // Save image to photolibrary
  public saveImages() {
    if(this.storageSvc.get('saveToLibrary') === 'true') {
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

  // Check options for image (toggle)
  public checkedImage() {
    this.isCheckedImage = this.storageSvc.get('saveToLibrary') === 'true' ? true : false;
  }

  // Check options for image (toggle)
  public checkedQuality() {
    this.imageQuality = +this.storageSvc.get('imageQuality');
  }

  // Check options for user fb (toggle)
  public checkedFb() {
    if(this.storageSvc.get('facebook_user_id') !== 'undefined') {
      this.isCheckedFb = true;
    } else {
      this.isCheckedFb = false;
    }
  }

  // Button controls (enable or not)
  public enableBtn() {
    if((this.storageSvc.get('facebook_user_id') !== 'undefined') && (this.storageSvc.get('loginBoth') === 'false')) {
      this.isEnabled = true;
    } else {
      this.isEnabled = false;
    }
  }

  // Check all
  public checkAll() {
    this.checkedImage();
    this.checkedQuality();
    this.checkedFb();
    this.enableBtn();
  }

  // Show range
  public showRange() {
    this.isShow = !this.isShow;
    this.storageSvc.set('imageQuality', this.imageQuality.toLocaleString());
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
  public addFacebook() {
    let permissions = new Array<string>();
    permissions = ['public_profile', 'email'];

    this.uiCmp.showLoading();
    this.fb.login(permissions).then(
      (res: FacebookLoginResponse) => {
        let facebookCredentials = {
          facebook_user_id: res.authResponse.userID,
          facebook_token: res.authResponse.accessToken
        };
        this.authSvc.addFacebook(facebookCredentials).subscribe(
          (success) => {
            this.storageSvc.set('facebook_user_id', res.authResponse.userID);
            this.storageSvc.set('loginBoth', 'true');
            this.uiCmp.loading.dismiss();
            this.uiCmp.presentToastSuccess('Added successfully');
          },
          (error) => {
            this.uiCmp.loading.dismiss();
            this.uiCmp.presentToastError('Something went wrong: ' + error);
          }
        );
      }
    ).catch(
      (error) => {
        this.uiCmp.loading.dismiss();
        this.uiCmp.presentToastError('Error logging into Facebook: ' + error);
      }
    );
  }

  // Remove facebook
  public removeFacebook() {
    this.uiCmp.showLoading();
    this.authSvc.removeFacebook().subscribe(
      (success) => {
        this.storageSvc.set('facebook_user_id', 'undefined');
        this.storageSvc.set('loginBoth', 'false');
        this.fb.logout();
        this.uiCmp.loading.dismiss();
        this.uiCmp.presentToastSuccess('Removed successfully');
      },
      (error) => {
        this.uiCmp.loading.dismiss();
        this.uiCmp.presentToastError('Something went wrong: ' + error);
      }
    );
  }

  // Change facebook
  public changeFacebokState() {
    if(this.storageSvc.get('loginBoth') === 'false') {
      this.addFacebook();
    } else {
      this.removeFacebook();
    }
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
