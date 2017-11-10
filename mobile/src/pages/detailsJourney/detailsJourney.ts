import { Component } from "@angular/core";
import { ToastController, Platform, NavParams, MenuController } from "ionic-angular";
import { FileTransfer, FileUploadOptions, FileTransferObject } from "@ionic-native/file-transfer";
import { Geolocation } from '@ionic-native/geolocation';
import { File } from "@ionic-native/file";
import { FilePath } from "@ionic-native/file-path";
import { Camera } from "@ionic-native/camera";

import { ImageService } from "../../providers/image-service";

declare var cordova: any;

@Component({
  selector: "page-detailsJourney",
  templateUrl: "detailsJourney.html"
})

export class DetailsJourneyPage {

  ionViewDidLoad() {
    this.menuCtrl.enable(false);
  }

  ionViewWillLeave() {
    this.menuCtrl.enable(true);
  }

  lastImage: string = null;

  lat: string = "";
  long: string = "";
  title_travel: string = "";

  constructor(public toastCtrl: ToastController, public platform: Platform, public navParams: NavParams, public geolocation: Geolocation, public menuCtrl: MenuController,
    private camera: Camera, private file: File, private filePath: FilePath, private imageSvc: ImageService, private transfer: FileTransfer) {

      this.title_travel = navParams.get('title_travel');
  }

  // TAKE PICTURE
  public takePicture() {

    this.getGeo();

    let PhotoOptions = {
      quality: 100,
      targetWidth: 2000,
      targetHeight: 2000,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: this.camera.EncodingType.JPEG,
      saveToPhotoAlbum: true
    };

    this.camera.getPicture(PhotoOptions).then(imageData => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      
      let imageCredentials = {
        date: "",
        longitude: "" + this.long,
        latitude: "" + this.lat,
        id_journey: this.navParams.get("id_travel"),
        tags: [],
        isFavourite: false,
        access_token: localStorage.getItem("token")
      };

      this.imageSvc.saveImage(imageCredentials).subscribe(
        data => {
          this.uploadToCloudinary(imageData, data._id);
          //alert("Picture was saved");
          this.presentToastSuccess("Picture was saved");
        },
        err => {
          //alert("Picture wasn't saved");
          this.presentToastError("Picture wasn't saved");
        }
      );
    });
  }

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
      data => {
        // success
        alert("success: " + imageName);
        //this.presentToast("Success: " + imageName);
      },
      err => {
        // error
        alert("error" + JSON.stringify(err));
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
  //                 id_journey     : this.navParams.get("id_travel"),
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

  private presentToastSuccess(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: "bottom",
      cssClass: "success"
    });
    toast.present();
  }

  private presentToastError(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: "bottom",
      cssClass: "error"
    });
    toast.present();
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return "";
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  getGeo() {
    
    this.geolocation.getCurrentPosition().then((resp) => {
      this.lat = "" + resp.coords.latitude,
      this.long = "" + resp.coords.longitude

    }).catch((err) => {
      console.log('err', err);
    });
  }
}
