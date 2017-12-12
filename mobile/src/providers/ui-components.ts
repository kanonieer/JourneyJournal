import { Injectable } from '@angular/core';
import { ToastController, LoadingController, Loading } from 'ionic-angular';

@Injectable()
export class uiComp {

  public loading: Loading;

  constructor(public toastCtrl: ToastController, public loadingCtrl: LoadingController) {

  }

  // TOASTS //
  // Success
  public presentToastSuccess(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: "bottom",
      cssClass: "success",
      showCloseButton: true
    });
    toast.present();
  }

  // Error
  public presentToastError(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: "bottom",
      cssClass: "error",
      showCloseButton: true
    });
    toast.present();
  }

  // Common
  public presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: "bottom",
      showCloseButton: true
    });
    toast.present();
  }

  // LOADING //
  // Show
  public showLoading() {
    this.loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Please wait'
    });
    this.loading.present();
  }
}
