import { Component } from "@angular/core";
import { NavController, ToastController, MenuController, ActionSheetController, AlertController, ModalController,
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
  }

  ionViewWillLeave() {
    this.menuCtrl.enable(true);
  }

  public images: Array<Image>;
  loading: Loading;
  lastImage: string = null;
  lat: string = "";
  long: string = "";
  id_journey = this.navParams.get('id_journey');
  
  journeyCredentials = {
    title: this.navParams.get('title_journey')
  };
  PhotoOptions = {
    quality: 100,
    targetWidth: 2000,
    targetHeight: 2000,
    destinationType: this.camera.DestinationType.FILE_URI,
    sourceType: this.camera.PictureSourceType.CAMERA,
    allowEdit: true,
    encodingType: this.camera.EncodingType.JPEG,
    saveToPhotoAlbum: false
  };
  navOptions = {
    animate: true,
    animation: 'transition',
    duration: 600,
    direction: 'back'
  };

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public menuCtrl: MenuController, public actionSheetCtrl: ActionSheetController, public alertCtrl: AlertController,
    public modalCtrl: ModalController, public viewCtrl: ViewController, public loadingCtrl: LoadingController, public navParams: NavParams, private camera: Camera, private file: File, private transfer: FileTransfer,
    private filePath: FilePath, private geolocation: Geolocation, private imageSvc: ImageService, private journeySvc: JourneyService, private storageSvc: StorageService) {
      // this.getImages();
      
  }

  // public getImages() {
  //   console.log(this.id_journey);
  //   console.log(this.title_travel);
  
  //   this.imageSvc.getImagesByJourney(this.id_journey).subscribe(
  //     data => {
  //       this.images = data;
  //       console.log(this.images);
  //     }, 
  //     err => console.log(err)
  //   );
  // }

  // CAMERA //
  // Take picture
  public takePicture() {
    this.getGeo();
    this.toBool('save_images');
    this.camera.getPicture(this.PhotoOptions).then(imageData => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      
      let imageCredentials = {
        date: "",
        longitude: "" + this.long,
        latitude: "" + this.lat,
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
    });
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
        this.loading.dismiss();
        alert("Success: " + imageName);
      },
      (error) => {
        this.loading.dismiss();
        alert("error" + JSON.stringify(error));
      }
    );
  }

  // FROM LIBRARY
  //   public loadPhoto() {
  //     this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
  //   }

  //   public takePicture(sourceType) {
  //   // Create options for the Camera Dialog
  //   var options = {
  //     quality: 100,
  //     sourceType: sourceType,
  //     saveToPhotoAlbum: false,
  //     correctOrientation: true
  //   };

  //   // Get the data of an image
  //   // currentName: Grab the current name of the image from the path
  //   // correctPath: Get only the path to the image without the name
  //   this.camera.getPicture(options).then((imagePath) => {
  //     // Special handling for Android library
  //     if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
  //       this.filePath.resolveNativePath(imagePath)
  //         .then(filePath => {
  //           let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
  //           let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
  //           this.copyFileToLocalDir(correctPath, currentName, this.createFileName());

  //           this.file.readAsDataURL(correctPath, currentName).then(
  //           file64 => {
  //             //alert('file in 64: ' + file64);
  //               let fileWithoutExtension = ('' + file64 + '').replace(/^data:image\/(png|jpg);base64,/, '');
  //               let imageCredentials={
  //                 file           : fileWithoutExtension,
  //                 date           : "",
  //                 longitude      : "",
  //                 latitude       : "",
  //                 id_journey     : this.navParams.get("id_journey"),
  //                 tags           : [],
  //                 access_token : localStorage.getItem('token')
  //               }
  //               let options: FileUploadOptions = {
  //               fileKey: 'file',
  //               fileName: 'name.jpg',
  //               headers: {}
  //               }
  //             const fileTransfer: FileTransferObject = this.transfer.create();
  //             fileTransfer.upload(filePath, 'https://api.cloudinary.com/v1_1/z1ydzdqc/image/upload', options)
  //             .then((data) => {
  //               alert("udalo sie wyslac zdjecia");
  //               console.log("udalo sie wyslac zdjecia");
  //             }, (err) => {
  //               alert("nie udalo sie wyslac zdjecia");
  //               console.log("nie udalo sie wyslac zdjecia");
  //             });
  //               // this.auth.saveImage(imageCredentials).subscribe(
  //               //   data=>{
  //               //     alert("Udalo sie zapisac zdjecie");
  //               //   },
  //               //   err=>{
  //               //     alert("Nie udalo sie zapisac zdjecia");
  //               //   }
  //               // );
  //           }).catch(err => {
  //           console.log('booooooo');
  //         });
  //         });
  //     } else {
  //       var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
  //       var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
  //       this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
  //     }
  //   }, (err) => {
  //     this.presentToast('Error while selecting image.');
  //   });
  // }

  // Create a new name for the image
  // private createFileName() {
  //   var d = new Date(),
  //     n = d.getTime(),
  //     newFileName = n + ".jpg";
  //   return newFileName;
  // }

  // Copy the image to a local folder
  // copyFileToLocalDir: Copy from the current path to our app and use new name from createFileName
  // private copyFileToLocalDir(namePath, currentName, newFileName) {
  //   this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(
  //     success => {
  //       this.lastImage = newFileName;
  //     },
  //     error => {
  //       this.presentToast("Error while storing file");
  //     }
  //   );
  // }

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

  // GEOLOCATION //
  // Get
  getGeo() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.lat = "" + resp.coords.latitude,
      this.long = "" + resp.coords.longitude
    }).catch((err) => {
      console.log('err', err);
    });
  }

  // ACTION SHEET //
  // Present
  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: this.journeyCredentials.title,
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
    return this.PhotoOptions.saveToPhotoAlbum = this.storageSvc.get(storage) === 'true' ? true : false;
  }
}
