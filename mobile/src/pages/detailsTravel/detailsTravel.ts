import { Component } from '@angular/core';
import { NavController, ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
 
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
 
declare var cordova: any;
 
@Component({
  selector: 'detailsTravel',
  templateUrl: 'detailsTravel.html'
})
export class DetailsTravelPage {
  lastImage: string = null;
  loading: Loading;
 
  constructor(public navCtrl: NavController, 
  private camera: Camera, 
  private file: File, 
  private filePath: FilePath, 
  public actionSheetCtrl: ActionSheetController, 
  public toastCtrl: ToastController, 
  public platform: Platform, 
  public loadingCtrl: LoadingController,
  private auth: AuthService) { }
  imageCredentials;
  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  public takePicture(sourceType) {
  // Create options for the Camera Dialog
  var options = {
    quality: 100,
    sourceType: sourceType,
    saveToPhotoAlbum: false,
    correctOrientation: true
  };
 
  // Get the data of an image
  // currentName: Grab the current name of the image from the path
  // correctPath: Get only the path to the image without the name
  this.camera.getPicture(options).then((imagePath) => {
    // Special handling for Android library
    if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
      this.filePath.resolveNativePath(imagePath)
        .then(filePath => {
          let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
          let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());

          this.file.readAsDataURL(correctPath, currentName).then(
          file64 => {
            //alert('file in 64: ' + file64);
              let fileWithoutExtension = ('' + file64 + '').replace(/^data:image\/(png|jpg);base64,/, '');
              let imageCredentials={
                file           : file64,
                date           : "",
                longitude      : "",
                latitude       : "",
                id_journey     : "592adb8cdad2f811c822f8cf",
                tags           : [],
                access_token : localStorage.getItem('token')
              }
              this.auth.saveImage(imageCredentials).subscribe(
                data=>{
                  alert("Udalo sie zapisac zdjecie");
                },
                err=>{
                  alert("Nie udalo sie zapisac zdjecia");
                }
              );     
          }).catch(err => {
          console.log('booooooo');
        });

          // let image = this.file.readAsDataURL(correctPath, currentName);
          // alert(image);
          // this.imageCredentials={
          //   file           : image,
          //   date           : "",
          //   longitude      : "",
          //   latitude       : "",
          //   id_journey     : "592adb8cdad2f811c822f8cf",
          //   tags           : [],
          //   access_token : localStorage.getItem('token')
          // }
          // this.auth.saveImage(this.imageCredentials).subscribe(
          //   data=>{
          //     alert("Udalo sie zapisac zdjecie");
          //   },
          //   err=>{
          //     alert("Nie udalo sie zapisac zdjecia");
          //   }
          // );
          
        });
    } else {
      var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
      var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
      this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
    }
  }, (err) => {
    this.presentToast('Error while selecting image.');
  });
}

// Create a new name for the image
private createFileName() {
  var d = new Date(),
  n = d.getTime(),
  newFileName =  n + ".jpg";
  return newFileName;
}
 
// Copy the image to a local folder
// copyFileToLocalDir: Copy from the current path to our app and use new name from createFileName
private copyFileToLocalDir(namePath, currentName, newFileName) {
  this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
    this.lastImage = newFileName;
  }, error => {
    this.presentToast('Error while storing file.');
  });
}
 
private presentToast(text) {
  let toast = this.toastCtrl.create({
    message: text,
    duration: 3000,
    position: 'top'
  });
  toast.present();
}
 
// Always get the accurate path to your apps folder
public pathForImage(img) {
  if (img === null) {
    return '';
  } else {
    return cordova.file.dataDirectory + img;
  }
}
}