import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NavParams, ViewController, Events } from 'ionic-angular';

// Providers
import { ImageService } from '../../providers/image-service';
import { uiComp } from '../../providers/ui-components';

@IonicPage()
@Component({
  selector: 'page-largeImage',
  templateUrl: 'largeImage.html',
  providers: [ImageService, uiComp]
})

export class LargeImagePage {

  public idToInitial;
  public idToDelete;
  public images;
  public initial;
  public isEnable = false;

  constructor(public params: NavParams, public viewCtrl: ViewController, public events: Events, private imageSvc: ImageService, private uiCmp: uiComp) {

    this.startModal();
    this.getCurrentImage();
  }

  // MODALS //
  // Start
  public startModal() {
    this.idToInitial = this.params.get('id');
    this.images = this.params.get('images');
  }

  // Dissmiss
  public dismiss() {
    this.viewCtrl.dismiss();
  }

  // IMAGES //
  // Get current image
  public getCurrentImage() {
    for(let i = 0; i < this.images.length; i++) {
      if(this.images[i]._id === this.idToInitial) {
        this.initial = i;
      }
    }
  }

  // Delete image
  public deleteImage() {
    alert(this.idToDelete);
    this.imageSvc.deleteImage(this.idToDelete).subscribe(
      (success) => {
        this.uiCmp.presentToastSuccess('Images successfully deleted');
      },
      (error) => {
        this.uiCmp.presentToastError('Something went wrong: ' + error);
      }
    );
    this.reloadImages();
    this.dismiss();
  }

  // Reload images
  public reloadImages() {
    this.events.publish('images:get');
  }

  // Open menu when clicked
  public openMenu(id) {
    this.isEnable = !this.isEnable;
    this.idToDelete = id;
  }

  // Close when slided
  public closeMenu() {
    this.isEnable = false;
  }
}
