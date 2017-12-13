import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-largeImage',
  templateUrl: 'largeImage.html'
})

export class LargeImagePage {

  public id;
  public images;
  public initial;

  constructor(public params: NavParams, public viewCtrl: ViewController) {

    this.startModal();
    this.getCurrentImage();
  }

  // MODALS //
  // Start
  public startModal() {
    this.id = this.params.get('id');
    this.images = this.params.get('images');
  }

  // Dissmiss
  public dismiss() {
    this.viewCtrl.dismiss();
  }

  public getCurrentImage() {
    for(let i = 0; i < this.images.length; i++) {
      if(this.images[i]._id === this.id) {
        this.initial = i;
      }
    }
  }
}
