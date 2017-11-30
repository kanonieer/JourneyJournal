import { Component } from '@angular/core';
import { NavController, AlertController, ToastController, MenuController, ModalController, Events, ItemSliding } from 'ionic-angular';

// Pages
import { AddJourneyPage } from '../addJourney/addJourney';
import { DetailsJourneyPage } from '../detailsJourney/detailsJourney';
import { EditJourneyPage } from '../editJourney/editJourney';

// Providers
import { JourneyService } from '../../providers/journey-service';

// Models
import { Journey } from './../../models/Journey';

@Component({
  selector: 'page-journeys',
  templateUrl: 'journeys.html',
  providers: [JourneyService]
})

export class JourneysPage {

  ionViewDidLoad() {
    this.menuCtrl.enable(true);
    this.getJourneys();
  }

  public journeys: Array<Journey>;
  public loadedJourneys: Array<Journey>;
  private showSearchbar: boolean = false;
  private searchQuery = '';

  navOptions = {
    animate: true,
    animation: 'transition',
    duration: 600,
    direction: 'forward'
  };

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public toastCtrl: ToastController, public menuCtrl: MenuController, 
    public modalCtrl: ModalController, public events: Events, private journeySvc: JourneyService) {

    events.subscribe('journey:get', () => {
      this.getJourneys();
    });
  }

  // JOURNEYS //
  // Add
  addJourney() {
    this.navCtrl.push(AddJourneyPage, {}, this.navOptions);
    this.toggleSearchbarOff();
  }

  // Edit
  public editJourney(id: String, title: String, item: ItemSliding) {
    item.close();
    let data = {
      id_journey: id,
      title_journey: title
    };
    let modal = this.modalCtrl.create(EditJourneyPage, data); 
    modal.present();
    this.toggleSearchbarOff();
  }

  // Details
  public detailsJourney(id: String, title: String) {
    this.navCtrl.push(DetailsJourneyPage, {
      id_journey: id,
      title_journey: title
    }, this.navOptions);
    this.toggleSearchbarOff();
  }

  // Get all
  public getJourneys() {
    this.journeySvc.getJourneys().subscribe(
      (data: Array<Journey>) => {
        this.journeys = data;
        this.loadedJourneys = data;
      }, 
      (error) => {
        this.presentToastError(error);
      }
    );
  }

  // Confirm
  public deleteConfirm(id: String, item: ItemSliding) {
    item.close();
    const alert = this.alertCtrl.create({
      title: 'Confirm delete',
      message: 'Do you want to delete this journey?',
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
  public deleteJourney(id: String) {
    // 'for' loop through the list, and delete selected item
    for(let i = 0; i < this.journeys.length; i++) {
      if(this.journeys[i]._id === id) {
        this.journeySvc.deleteJourney(id).subscribe(
          (result) => {
            this.journeys.splice(i, 1);
            this.presentToastSuccess(result);
          },
          (error) => {
            this.presentToastError(error);
          }
        );
      }
    }
    this.toggleSearchbarOff();
  }

  // TOAST //
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

  // SEARCHBAR //
  // On
  toggleSearchbarOn() {
    this.showSearchbar = true;
  }

  // Off
  toggleSearchbarOff() {
    this.showSearchbar = false;
    this.searchQuery = '';
    this.initializeItems();
  }

  // Needed for search bar
  initializeItems(): void {
    this.journeys = this.loadedJourneys;
  }

  // Search
  getItems(searchbar) {
    this.initializeItems();
    let typedValue = searchbar.srcElement.value;
    // trim => remove whitespace from both sides of a String
    if (typedValue && typedValue.trim() !== '') {
      this.journeys = this.journeys.filter((journey) => {
        if(journey.title && typedValue) {
          if(journey.title.toLowerCase().indexOf(typedValue.toLowerCase()) > -1) {
            return true;
          }
          return false;
        }
      });
    }
  }

  // REFRESHER //
  doRefresh(refresher) {
    this.getJourneys();

    setTimeout(() => {
      refresher.complete();
    }, 500);
  }
}