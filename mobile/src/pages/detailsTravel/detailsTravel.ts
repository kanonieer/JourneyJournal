import { Component } from '@angular/core';

import { ActionSheetController } from 'ionic-angular';

@Component({
  selector: 'detailsTravel',
  templateUrl: 'detailsTravel.html'
})
export class DetailsTravelPage {

  constructor(public actionSheetCtrl: ActionSheetController) {

  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'What do you want to do?',
      buttons: [
        {
          text: 'Modify',
          role: 'modify',
          handler: () => {
            console.log('Modify clicked');
          }
        },{
          text: 'Delete',
          role: 'delete',
          handler: () => {
            console.log('Delete clicked');
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
}
