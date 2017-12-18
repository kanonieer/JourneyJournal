import { Component } from "@angular/core";
import { IonicPage } from 'ionic-angular';
import { Platform, NavController, MenuController, ActionSheetController, AlertController, ModalController, ViewController, Events, NavParams } from "ionic-angular";

// Plugins
import { Camera, CameraOptions } from "@ionic-native/camera";
import { FileTransfer, FileUploadOptions, FileTransferObject } from "@ionic-native/file-transfer";
import { Geolocation } from '@ionic-native/geolocation';
import { ImagePicker } from '@ionic-native/image-picker';

// Providers
import { ImageService } from "../../providers/image-service";
import { JourneyService } from "../../providers/journey-service";
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
  providers: [ImageService, JourneyService, StorageService, uiComp]
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

  public images: Array<Image>;
  public lastImage: String = null;
  public id_journey = this.navParams.get('id_journey');
  
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
    maximumImagesCount: 100,
    quality: 100,
    outputType: 0 //0 - FILE_URI, 1 - BASE64_STRING
  };

  constructor(public platform: Platform, public navCtrl: NavController, public menuCtrl: MenuController, public actionSheetCtrl: ActionSheetController, public alertCtrl: AlertController,
    public modalCtrl: ModalController, public viewCtrl: ViewController, public events: Events, public navParams: NavParams, private camera: Camera, private transfer: FileTransfer,
    private geolocation: Geolocation, private imagePicker: ImagePicker, private imageSvc: ImageService, private journeySvc: JourneyService,
    private storageSvc: StorageService, private uiCmp: uiComp) {
      
      events.subscribe('images:get', () => {
        this.getImages();
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
            this.uploadToCloudinary(imageData, data._id);
          },
          (error) => {
            alert(error);
          }
        );
      }
    );
  }

  // Upload
  public uploadToCloudinary(file, imageName) {
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
        this.getImages();
        this.uiCmp.loading.dismiss();
        this.uiCmp.presentToastSuccess("Added successfully");
      },
      (error) => {
        this.uiCmp.loading.dismiss();
        this.uiCmp.presentToastError("Something went wrong: " + error);
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
                this.uploadToCloudinary(imageData[i], data._id);
              } else {
                this.uploadToCloudinary(imageData[i], data._id);
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

  // JOURNEYS //
  // Edit
  public editJourney(id: String, title: String) {
    let data = {
      id_journey: id,
      title_journey: title
    };
    let modal = this.modalCtrl.create('EditJourneyPage', data);
    this.navCtrl.pop();
    modal.present();
  }

  // Confirm
  public deleteConfirm(id) {
    const alert = this.alertCtrl.create({
      title: 'Confirm delete',
      message: 'Do you want to delete ' + this.journeyCredentials.title + '?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteJourney(id);
          }
        }
      ]
    });
    alert.present();
  }

  // Delete
  public deleteJourney(id) {
    this.journeySvc.deleteJourney(id).subscribe(
      (result) => {
        this.uiCmp.presentToastSuccess(result);
      },
      (error) => {
        this.uiCmp.presentToastError(error);
      }
    );
    this.navCtrl.setRoot('JourneysPage', {}, navOptionsBack);
  }

  // Get images
  public getImages() {
    this.imageSvc.getImagesByJourney(this.id_journey).subscribe(
      (data: Array<Image>) => {
        this.images = data;
      }, 
      (error) => {
        this.uiCmp.presentToastError(error);
      }
    );
  }

  // Get larger image
  public largerPhoto(id) {
    let modal = this.modalCtrl.create('LargeImagePage', {id, images: this.images, id_journey: this.id_journey});
    modal.present();
  }

  // Delete alert
  public deleteAlert(id) {
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
                this.getImages();
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

  // ACTION SHEET //
  // Present
  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Options for this journey',
      buttons: [
        {
          text: 'Edit',
          handler: () => {
            this.editJourney(this.id_journey, this.journeyCredentials.title);
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteConfirm(this.id_journey);
          }
        }
      ]
    });
    actionSheet.present();
  }

  // NAV //
  // Back
  public back() {
    this.navCtrl.pop(navOptionsBack);
  }

  // SETTINGS //
  // Change to bool
  public toBool(storage) {
    return this.PhotoOptionsTake.saveToPhotoAlbum = this.storageSvc.get(storage) === 'true' ? true : false;
  }
}
