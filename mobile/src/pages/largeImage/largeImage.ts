import { Component, ViewChild } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NavParams, ViewController, AlertController, Events, Slides } from 'ionic-angular';

// Providers
import { ImageService } from '../../providers/image-service';
import { JourneyService } from '../../providers/journey-service';
import { StorageService } from '../../providers/storage-service';
import { uiComp } from '../../providers/ui-components';

@IonicPage()
@Component({
  selector: 'page-largeImage',
  templateUrl: 'largeImage.html',
  providers: [ImageService, JourneyService, StorageService, uiComp]
})

export class LargeImagePage {

  @ViewChild(Slides) slides: Slides;

  public idToInitial;
  public idToDelete;
  public idJourney;
  public title;
  public images;
  public initial;
  public isEnable = false;
  public isFavourite;

  constructor(public params: NavParams, public viewCtrl: ViewController, public alertCtrl: AlertController, public events: Events, private imageSvc: ImageService, private journeySvc: JourneyService,
    private storageSvc: StorageService, private uiCmp: uiComp) {

    this.startModal();
    this.getCurrentImage();
  }

  // MODALS //
  // Start
  public startModal() {
    this.idToInitial = this.params.get('id');
    this.images = this.params.get('images');
    this.idJourney = this.params.get('id_journey');
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

  // Edit image
  public editImage() {
    const alert = this.alertCtrl.create({
      title: 'Edit photo',
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Edit',
          handler: (data) => {
            let photo = {
              title: data.title,
              access_token: this.storageSvc.get('token')
            };
            this.imageSvc.updateImage(this.idToDelete, photo).subscribe(
              (success) => {
                let activeSlide = this.slides.realIndex;
                this.reloadImages();
                this.title = data.title;
                this.images[activeSlide].title = data.title;
              },
              (error) => {
                this.uiCmp.presentToastError('Something went wrong: ' + error);
              }
            );
          }
        }
      ]
    });
    alert.present();
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

  // Set background
  public setBackground() {
    let backgroud = {
      background_image_id: this.idToDelete,
      access_token: this.storageSvc.get('token')
    };
    this.journeySvc.editJourney(this.idJourney, backgroud).subscribe(
      (data) => {
        this.reloadJourneys();
        this.uiCmp.presentToastSuccess(data.message);
      },
      (error) => {
        this.uiCmp.presentToastError(error.message);
      }
    );
  }

  // Set favourite
  public favouriteImage() {
    let favourite = {
      isFavourite: !this.isFavourite,
      access_token: this.storageSvc.get('token')
    };
    this.imageSvc.updateImage(this.idToDelete, favourite).subscribe(
      (data) => {
        let activeSlide = this.slides.realIndex;
        this.reloadImages();
        this.isFavourite = !this.isFavourite;
        this.images[activeSlide].isFavourite = !this.images[activeSlide].isFavourite;
      },
      (error) => {
        this.uiCmp.presentToastError(error.message);
      }
    );
  }

  // Reload images
  public reloadImages() {
    this.events.publish('images:get');
  }

  // Open menu when clicked
  public openMenu(id, title, isFavourite) {
    this.isEnable = !this.isEnable;
    this.idToDelete = id;
    this.title = title;
    this.isFavourite = isFavourite;
  }

  // Close when slided
  public closeMenu() {
    this.isEnable = false;
  }

  // JOURNEYS //
  // Reload
  public reloadJourneys() {
    this.events.publish('journey:get');
  }
}
