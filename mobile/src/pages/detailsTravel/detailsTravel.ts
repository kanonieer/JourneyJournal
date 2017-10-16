import { Component } from "@angular/core";
import {
  NavController,
  ActionSheetController,
  ToastController,
  Platform,
  LoadingController,
  Loading,
  NavParams
} from "ionic-angular";
import { AuthService } from "../../providers/auth-service";
// import { Cloudinary } from '@cloudinary/angular-4.x';
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from "@ionic-native/file-transfer";

import { File } from "@ionic-native/file";
import { FilePath } from "@ionic-native/file-path";
import { Camera } from "@ionic-native/camera";

declare var cordova: any;
//var cloudinary = require('cloudinary');

@Component({
  selector: "page-detailsTravel",
  templateUrl: "detailsTravel.html"
})
export class DetailsTravelPage {
  lastImage: string = null;
  loading: Loading;

  constructor(
    public navCtrl: NavController,
    private camera: Camera,
    private file: File,
    private filePath: FilePath,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    private auth: AuthService,
    public navParams: NavParams,
    //private cloudinary: Cloudinary,
    private transfer: FileTransfer
  ) {}

  public base64Image: string;

  public upload() {
    let PhotoOptions = {
      quality: 100,
      targetWidth: 2000,
      targetHeight: 2000,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: this.camera.EncodingType.JPEG,
      saveToPhotoAlbum: false
    };
    this.camera.getPicture(PhotoOptions).then(imageData => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:

      let imageCredentials = {
        date: "",
        longitude: "",
        latitude: "",
        id_journey: this.navParams.get("id_travel"),
        tags: [],
        access_token: localStorage.getItem("token")
      };

      this.auth.saveImage(imageCredentials).subscribe(
        data => {
          this.uploadToCloudinary(imageData, data._id);
          alert("Udalo sie zapisac zdjecie");
        },
        err => {
          alert("Nie udalo sie zapisac zdjecia");
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

    fileTransfer
      .upload(
        file,
        "http://api.cloudinary.com/v1_1/dzgtgeotp/upload",
        UploadOptions
      )
      .then(
        data => {
          // success
          alert("success" + imageName);
        },
        err => {
          // error
          alert("error" + JSON.stringify(err));
        }
      );
  }
  public takePicture() {
    this.camera
      .getPicture({
        quality: 75,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: this.camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 300,
        saveToPhotoAlbum: false
      })
      .then(
        imageData => {
          let options: FileUploadOptions = {
            fileKey: "file",
            fileName: "name.jpg",
            params: {
              upload_preset: "z1ydzdqc"
            }
          };
          //cloudinary.uploader.upload
          const fileTransfer = this.transfer.create();
          fileTransfer
            .upload(
              imageData,
              "https://api.cloudinary.com/v1_1/dzgtgeotp/upload",
              options
            )
            .then(
              data => {
                alert("udalo sie wyslac zdjecia " + data);
              },
              err => {
                alert("nie udalo sie wyslac zdjecia " + err);
              }
            );
          alert(imageData);
          //this.base64Image = "data:image/jpeg;base64," + imageData;
        },
        error => {
          console.log("ERROR -> " + JSON.stringify(error));
        }
      );
  }

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
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  // Copy the image to a local folder
  // copyFileToLocalDir: Copy from the current path to our app and use new name from createFileName
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file
      .copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName)
      .then(
        success => {
          this.lastImage = newFileName;
        },
        error => {
          this.presentToast("Error while storing file.");
        }
      );
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: "top"
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
}
