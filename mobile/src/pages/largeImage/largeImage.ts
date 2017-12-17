import { Component, ViewChild } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NavParams, ViewController, Events, Slides } from 'ionic-angular';

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

  @ViewChild(Slides) slides: Slides;

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
    this.imageSvc.deleteImage(this.idToDelete).subscribe(
      (success) => {
        let activeSlide = this.slides.realIndex;
        this.reloadImages(); 
        if(this.slides.isEnd()) {
          this.slides.slideTo(activeSlide - 1, 500);
          this.images.splice(activeSlide, 1);
          this.slides.update();
          this.isEnable = false;
        } else {
          this.images.splice(activeSlide, 1);
          this.slides.update();
          this.isEnable = false;
        }
        if(this.images.length === 0) {
          this.dismiss();
        }
        this.uiCmp.presentToastSuccess('Images successfully deleted');
      },
      (error) => {
        this.uiCmp.presentToastError('Something went wrong');
      }
    );
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
