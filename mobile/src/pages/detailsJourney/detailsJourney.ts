import { Component } from "@angular/core";
import { IonicPage } from 'ionic-angular';
import { NavController, MenuController, PopoverController, AlertController, ModalController, ViewController, Events, NavParams } from "ionic-angular";

// Plugins
import { Camera, CameraOptions } from "@ionic-native/camera";
import { FileTransfer, FileUploadOptions, FileTransferObject } from "@ionic-native/file-transfer";
import { Geolocation } from '@ionic-native/geolocation';
import { ImagePicker } from '@ionic-native/image-picker';

// Providers
import { ImageService } from "../../providers/image-service";
import { StorageService } from "../../providers/storage-service";
import { uiComp } from '../../providers/ui-components';

// Shared
import { navOptionsBack } from '../../shared/GlobalVariables';

// Models
import { Image } from '../../models/Image';

@IonicPage()
@Component({
  selector: "page-detailsJourney",
  templateUrl: "detailsJourney.html",
  providers: [ImageService, StorageService, uiComp]
})

export class DetailsJourneyPage {

  ionViewDidLoad() {
    this.menuCtrl.enable(false);
    this.viewCtrl.showBackButton(false);
    this.getImages();
  }

  ionViewWillLeave() {
    this.menuCtrl.enable(true);
  }

  public images: Array<Image> = [];
  public loadedImages: Array<Image> = [];
  public lastItem;
  public lastIndex;
  public scrollIsEnable = true;
  public id_journey = this.navParams.get('id_journey');
  public loadedJourneys = this.navParams.get('journeys');
  
  public journeyCredentials = {
    title: this.navParams.get('title_journey')
  };
  public geoCredentials = {
    lat: "",
    long: ""
  };
  public PhotoOptionsTake: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    sourceType: this.camera.PictureSourceType.CAMERA,
    // allowEdit: true,
    encodingType: this.camera.EncodingType.JPEG,
    saveToPhotoAlbum: false
  };
  public PhotoOptionsLoad = {
    maximumImagesCount: 20,
    quality: 100,
    outputType: 0 //0 - FILE_URI, 1 - BASE64_STRING
  };

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, public popoverCtrl: PopoverController, public alertCtrl: AlertController, public modalCtrl: ModalController,
    public viewCtrl: ViewController, public events: Events, public navParams: NavParams, private camera: Camera, private transfer: FileTransfer, private geolocation: Geolocation,
    private imagePicker: ImagePicker, private imageSvc: ImageService, private storageSvc: StorageService, private uiCmp: uiComp) {
      
    events.subscribe('images:get', () => {
      this.getImages();
    });

    events.subscribe('journey:update', (title) => {
      this.updateTitle(title);
    });

    events.subscribe('view:back', () => {
      this.backToJourneys();
    });

    events.subscribe('images:update', (images, loadedImages) => {
      this.images = images;
      this.loadedImages = loadedImages;
    });
  }

  // CAMERA //
  // Take picture
  public takePicture() {
    this.getGeo();
    this.toBool('saveToLibrary');
    this.camera.getPicture(this.PhotoOptionsTake).then(
      (imageData) => {
        let imageCredentials = {
          date: new Date().toISOString().substring(0, 10),
          longitude: "" + this.geoCredentials.long,
          latitude: "" + this.geoCredentials.lat,
          id_journey: this.navParams.get("id_journey"),
          tags: [],
          isFavourite: false,
          access_token: this.storageSvc.get('token')
        };

        this.imageSvc.saveImage(imageCredentials).subscribe(
          (data) => {
            this.uiCmp.showLoading();
            this.uploadToCloudinary(imageData, data._id, data);
          },
          (error) => {
            alert(error);
          }
        );
      }
    );
  }

  // Upload
  public uploadToCloudinary(file, imageName, newImage) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    let UploadOptions: FileUploadOptions = {
      fileKey: "file",
      fileName: imageName,
      headers: { "Access-Control-Allow-Origin": "*" },
      params: {
        upload_preset: "z1ydzdqc",
        public_id: imageName
      }
    };

    fileTransfer.upload(file, "http://api.cloudinary.com/v1_1/dzgtgeotp/upload", UploadOptions).then(
      (data) => {
        this.images.push(newImage);
        this.uiCmp.loading.dismiss();
        // this.uiCmp.presentToastSuccess("Added successfully");
      },
      (error) => {
        this.uiCmp.loading.dismiss();
        // this.uiCmp.presentToastError("Something went wrong: " + error);
      }
    );
  }

  // From library
  public loadPhoto() {
    this.imagePicker.getPictures(this.PhotoOptionsLoad).then(
      (imageData) => {
        for(let i = 0; i < imageData.length; i++) {
          let imageCredentials = {
            date           : "",
            longitude      : "",
            latitude       : "",
            id_journey     : this.navParams.get("id_journey"),
            tags           : [],
            isFavourite: false,
            access_token : localStorage.getItem('token')
          };
          this.imageSvc.saveImage(imageCredentials).subscribe(
            (data) => {
              if(i === 0) {
                this.uiCmp.showLoading();
                this.uploadToCloudinary(imageData[i], data._id, data);
              } else {
                this.uploadToCloudinary(imageData[i], data._id, data);
              }
            },
            (error) => {
              alert(error);
            }
          );
        }
      },
      (error) => {
        this.uiCmp.presentToastError('Error while selecting image');
      }
    );
  }

  // Get images
  public getImages() {
    this.imageSvc.getImagesByJourney(this.id_journey).subscribe(
      (data: Array<Image>) => {
        this.loadedImages = data;
        if(this.loadedImages.length > 30) {
          this.lastIndex = 30;
          for(let i = 0; i < this.lastIndex; i++) {
            this.images.push(this.loadedImages[i]);
            this.scrollIsEnable = true;
          }
        } else {
          for(let i = 0; i < this.loadedImages.length; i++) {
            this.images.push(this.loadedImages[i]);
            this.scrollIsEnable = false;
          }
        }
      }, 
      (error) => {
        this.uiCmp.presentToastError(error);
      }
    );
  }

  // Get larger image
  public largerPhoto(idToDelete) {
    let modal = this.modalCtrl.create('LargeImagePage', {images: this.images, loadedImages: this.loadedImages, index: idToDelete, journeys: this.loadedJourneys});
    modal.present();
  }

  // Get more image
  public loadMore(infiniteScroll) {

    setTimeout(() => {
      if(this.loadedImages.length - this.lastIndex > 30) {
        this.lastItem = this.lastIndex;
        this.lastIndex = this.lastIndex + 30;

        for(let i = this.lastItem; i < this.lastIndex; i++) {
          this.images.push(this.loadedImages[i]);
        }
      } else {
        if(this.lastIndex !== this.loadedImages.length) {
          for(let i = this.lastIndex; i < this.loadedImages.length; i++) {
            this.images.push(this.loadedImages[i]);
          }
          this.lastIndex = this.loadedImages.length
          this.scrollIsEnable = false;
        }
      }

      infiniteScroll.complete();
    }, 300);
  }

  // Delete alert
  public deleteAlert(id, idToDelete) {
    const alert = this.alertCtrl.create({
      title: 'Options for this image',
      message: 'Do you want to delete?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.imageSvc.deleteImage(id).subscribe(
              (success) => {
                this.images.splice(idToDelete, 1);
                this.uiCmp.presentToastSuccess('Images successfully deleted');
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

  // JOURNEYS //
  // Update title
  public updateTitle(newTitle) {
    this.journeyCredentials.title = newTitle;
  }

  // GEOLOCATION //
  // Get
  public getGeo() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.geoCredentials.lat = "" + resp.coords.latitude,
      this.geoCredentials.long = "" + resp.coords.longitude
    }).catch((err) => {
      console.log('err', err);
    });
  }

  // POPOVER //
  // Present
  public presentPopover(ev: UIEvent) {
    let popover = this.popoverCtrl.create('OptionsJourneyPage', {id: this.id_journey, title: this.journeyCredentials.title, journeys: this.loadedJourneys});
    popover.present({
      ev: ev
    });
  }

  // NAV //
  // Back
  public backToJourneys() {
    this.navCtrl.pop(navOptionsBack);
  }

  // SETTINGS //
  // Change to bool
  public toBool(storage) {
    return this.PhotoOptionsTake.saveToPhotoAlbum = this.storageSvc.get(storage) === 'true' ? true : false;
  }
}
