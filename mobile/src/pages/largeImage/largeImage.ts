import { Component, ViewChild } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NavParams, ViewController, AlertController, ActionSheetController, Events, Slides } from 'ionic-angular';

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

  public index;
  public images = [];
  public loadedImages = [];
  public journeys = [];
  public initialSlide;
  public title;
  public isFavourite;
  public isEnable = false;
  public test = false;

  constructor(public params: NavParams, public viewCtrl: ViewController, public alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, public events: Events, private imageSvc: ImageService,
    private journeySvc: JourneyService, private storageSvc: StorageService, private uiCmp: uiComp) {

    this.startModal();
  }

  // MODALS //
  // Start
  public startModal() {
    this.index = this.params.get('index');
    this.images = this.params.get('images');
    this.loadedImages = this.params.get('loadedImages');
    this.journeys = this.params.get('journeys');
    this.initialSlide = this.index;
  }

  // Dissmiss
  public dismiss() {
    this.viewCtrl.dismiss();
  }

  // IMAGES //
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
            let activeSlide = this.slides.realIndex;
            let photo = {
              title: data.title,
              access_token: this.storageSvc.get('token')
            };
            this.imageSvc.updateImage(this.loadedImages[activeSlide]._id, photo).subscribe(
              (success) => {
                this.title = data.title;
                if(activeSlide >= this.images.length) {
                  this.loadedImages[activeSlide].title = this.title;
                } else {
                  this.images[activeSlide].title = this.title;
                  this.loadedImages[activeSlide].title = this.title;
                }
                this.updateImages(this.images, this.loadedImages);
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
    let activeSlide = this.slides.realIndex;
    this.imageSvc.deleteImage(this.loadedImages[activeSlide]._id).subscribe(
      (success) => {
        if(this.slides.isEnd()) {
          this.slides.slideTo(activeSlide - 1, 500);
          if(activeSlide >= this.images.length) {
            this.loadedImages.splice(activeSlide, 1);
          } else {
            this.images.splice(activeSlide, 1);
            this.loadedImages.splice(activeSlide, 1);
          }
          this.updateImages(this.images, this.loadedImages);
          this.slides.update();
          this.isEnable = false;
        } else {
          if(activeSlide >= this.images.length) {
            this.loadedImages.splice(activeSlide, 1);
          } else {
            this.images.splice(activeSlide, 1);
            this.loadedImages.splice(activeSlide, 1);
          }
          this.updateImages(this.images, this.loadedImages);          
          this.slides.update();
          this.isEnable = false;
        }
        if(this.loadedImages.length === 0) {
          this.dismiss();
        }
        this.uiCmp.presentToastSuccess('Images successfully deleted');
      },
      (error) => {
        this.uiCmp.presentToastError('Something went wrong');
      }
    );
  }

  // Delete image actionSheet
  public deleteConfirm() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Do you want to delete this image?',
      buttons: [
        {
          icon: 'trash',
          text: 'Delete',
          handler: () => {
            this.deleteImage();
          }
        }
      ]
    });
 
    actionSheet.present();
  }

  // Set background
  public setBackground() {
    let activeSlide = this.slides.realIndex;
    let backgroud = {
      background_image_id: this.loadedImages[activeSlide]._id,
      access_token: this.storageSvc.get('token')
    };
    this.journeySvc.editJourney(this.loadedImages[activeSlide].id_journey, backgroud).subscribe(
      (data) => {
        for(let i = 0; i < this.journeys.length; i++) {
          if(this.journeys[i]._id === this.loadedImages[activeSlide].id_journey) {
            this.journeys[i].background_image_id = this.loadedImages[activeSlide]._id;
          }
        }
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
    let activeSlide = this.slides.realIndex;
    this.isFavourite = !this.isFavourite;
    let favourite = {
      isFavourite: this.isFavourite,
      access_token: this.storageSvc.get('token')
    };
    this.imageSvc.updateImage(this.loadedImages[activeSlide]._id, favourite).subscribe(
      (data) => {
        if(activeSlide >= this.images.length) {
          this.loadedImages[activeSlide].isFavourite = this.isFavourite;
        } else {
          this.images[activeSlide].isFavourite = this.isFavourite;
          this.loadedImages[activeSlide].isFavourite = this.isFavourite;
        }
        this.updateImages(this.images, this.loadedImages);
      },
      (error) => {
        this.uiCmp.presentToastError(error.message);
      }
    );
  }

  // Update images
  public updateImages(images, loadedImages) {
    this.events.publish('images:update', images, loadedImages);
  }

  // Open or close menu when clicked
  public menu() {
    let activeSlide = this.slides.realIndex;
    this.isEnable = !this.isEnable;
    this.title = this.loadedImages[activeSlide].title;
    this.isFavourite = this.loadedImages[activeSlide].isFavourite;
    this.initialSlide = activeSlide;
  }

  // Next slide
  public nextSlide() {
    let activeSlide = this.slides.realIndex;
    this.title = this.loadedImages[activeSlide].title;
    this.isFavourite = this.loadedImages[activeSlide].isFavourite;
    this.initialSlide = activeSlide;
  }

  // Prev slide
  public prevSlide() {
    let activeSlide = this.slides.realIndex;
    this.title = this.loadedImages[activeSlide].title;
    this.isFavourite = this.loadedImages[activeSlide].isFavourite;
    this.initialSlide = activeSlide;
  }

  // JOURNEYS //
  // Reload journeys
  public reloadJourneys() {
    this.events.publish('journeys:reload', this.journeys);
  }
}
