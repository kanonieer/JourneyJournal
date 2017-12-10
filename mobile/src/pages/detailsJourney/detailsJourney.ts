import { Component } from "@angular/core";
import { Platform, NavController, ToastController, MenuController, ActionSheetController, AlertController, ModalController,
  ViewController, LoadingController, Loading, NavParams } from "ionic-angular";

// Pages
import { EditJourneyPage } from '../editJourney/editJourney';
import { JourneysPage } from '../journeys/journeys';

// Plugins
import { Camera } from "@ionic-native/camera";
import { File } from "@ionic-native/file";
import { FileTransfer, FileUploadOptions, FileTransferObject } from "@ionic-native/file-transfer";
import { FilePath } from "@ionic-native/file-path";
import { Geolocation } from '@ionic-native/geolocation';
import { ImagePicker } from '@ionic-native/image-picker';

// Providers
import { ImageService } from "../../providers/image-service";
import { JourneyService } from "../../providers/journey-service";
import { StorageService } from "../../providers/storage-service";

// Models
import { Image } from '../../models/Image';

declare var cordova: any;

@Component({
  selector: "page-detailsJourney",
  templateUrl: "detailsJourney.html",
  providers: [ImageService, JourneyService, StorageService]
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
  loading: Loading;
  lastImage: String = null;
  id_journey = this.navParams.get('id_journey');
  
  journeyCredentials = {
    title: this.navParams.get('title_journey')
  };
  geoCredentials = {
    lat: "",
    long: ""
  };
  PhotoOptionsTake = {
    quality: 100,
    targetWidth: 2000,
    targetHeight: 2000,
    destinationType: this.camera.DestinationType.FILE_URI,
    sourceType: this.camera.PictureSourceType.CAMERA,
    allowEdit: true,
    encodingType: this.camera.EncodingType.JPEG,
    saveToPhotoAlbum: false
  };
  PhotoOptionsLoad = {
    maximumImagesCount: 100,
    width: 2000,
    height: 2000,
    quality: 100,
    outputType: 0 //0 - FILE_URI, 1 - BASE64_STRING
  };
  navOptions = {
    animate: true,
    animation: 'transition',
    duration: 600,
    direction: 'back'
  };

  constructor(public platform: Platform, public navCtrl: NavController, public toastCtrl: ToastController, public menuCtrl: MenuController, public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController, public modalCtrl: ModalController, public viewCtrl: ViewController, public loadingCtrl: LoadingController, public navParams: NavParams,
    private camera: Camera, private file: File, private transfer: FileTransfer, private filePath: FilePath, private geolocation: Geolocation, private imagePicker: ImagePicker,
    private imageSvc: ImageService, private journeySvc: JourneyService, private storageSvc: StorageService) {
      
  }

  // CAMERA //
  // Take picture
  public takePicture() {
    this.getGeo();
    this.toBool('save_images');
    this.camera.getPicture(this.PhotoOptionsTake).then(
      (imageData) => {
        
        let imageCredentials = {
          date: "",
          longitude: "" + this.geoCredentials.long,
          latitude: "" + this.geoCredentials.lat,
          id_journey: this.navParams.get("id_journey"),
          tags: [],
          isFavourite: false,
          access_token: this.storageSvc.get('token')
        };

        this.imageSvc.saveImage(imageCredentials).subscribe(
          (data) => {
            this.uploadToCloudinary(imageData, data._id);
            this.presentToastSuccess("Picture was saved");
            this.showLoading();
          },
          (error) => {
            this.presentToastError("Picture wasn't saved");
          }
        );
      }
    );
  }

  // Upload
  private uploadToCloudinary(file, imageName) {
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
        alert("Success: " + imageName);
        this.loading.dismiss();
        this.getImages();
      },
      (error) => {
        alert("error" + JSON.stringify(error));
        this.loading.dismiss();
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
              this.uploadToCloudinary(imageData[i], data._id);
              this.presentToastSuccess("Picture was saved");
              this.showLoading();
            },
            (error) => {
              this.presentToastError("Picture wasn't saved");
            }
          );
        }
      },
      (error) => {
        this.presentToastError('Error while selecting image.');
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
    let modal = this.modalCtrl.create(EditJourneyPage, data);
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
        this.presentToastSuccess(result);
      },
      (error) => {
        this.presentToastError(error);
      }
    );
    this.navCtrl.setRoot(JourneysPage, {}, this.navOptions);
  }

  // Get images
  public getImages() {
    this.imageSvc.getImagesByJourney(this.id_journey).subscribe(
      (data: Array<Image>) => {
        this.images = data;
      }, 
      (error) => {
        this.presentToastError(error);
      }
    );
  }

  // GEOLOCATION //
  // Get
  getGeo() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.geoCredentials.lat = "" + resp.coords.latitude,
      this.geoCredentials.long = "" + resp.coords.longitude
    }).catch((err) => {
      console.log('err', err);
    });
  }

  // ACTION SHEET //
  // Present
  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Options',
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

  // TOASTS //
  // Success
  private presentToastSuccess(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 1500,
      position: "bottom",
      cssClass: "success"
    });
    toast.present();
  }

  // Error
  private presentToastError(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 1500,
      position: "bottom",
      cssClass: "error"
    });
    toast.present();
  }

  // PATH //
  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return "";
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  // NAV //
  // Back
  back() {
    this.navCtrl.pop(this.navOptions);
  }

  // LOADING //
  // Show
  showLoading() {
    this.loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Please wait',
      duration: 2000
    });
    this.loading.present();
  }

  // SETTINGS //
  // Change to bool
  toBool(storage) {
    return this.PhotoOptionsTake.saveToPhotoAlbum = this.storageSvc.get(storage) === 'true' ? true : false;
  }
}
