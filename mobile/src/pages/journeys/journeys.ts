import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ToastController, MenuController, ModalController, ItemSliding } from 'ionic-angular';

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
  templateUrl: 'journeys.html'
})

export class JourneysPage implements OnInit {

  ionViewDidLoad() {
    this.menuCtrl.enable(true);
  }

  addJourneyPage = AddJourneyPage;

  public journeys: Array<Journey>;
  public loadedJourneys: Array<Journey>;
  public showSearchbar: boolean = false;
  public searchQuery;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public toastCtrl: ToastController, public menuCtrl: MenuController, 
    public modalCtrl: ModalController, private journeySvc: JourneyService) {
    this.getJourneys();
  }

  toggleSearchbar() {
    this.showSearchbar = !this.showSearchbar;
    this.searchQuery = '';
    this.initializeItems();
  }

  ngOnInit() {
  }

  public getJourneys() {
    this.journeySvc.getJourneys().subscribe(
      (data: Array<Journey>) => {
        this.journeys = data;
        this.loadedJourneys = data;
      }, 
      (err) => console.log(err)
    );
  }

  // Needed for search bar
  initializeItems(): void {
    this.journeys = this.loadedJourneys;
  }

  public detailsJourney(id: String, title: String, dateS: Date, dateE: Date) {
    this.navCtrl.push(DetailsJourneyPage, {
      id_journey: id,
      title_journey: title,
      date_start: dateS,
      date_end: dateE
    });
  }

  public deleteJourney(id: String) {
    // 'for' loop through the list, and delete selected item
    for(let i = 0; i < this.journeys.length; i++) {
      if(this.journeys[i]._id == id) {
        this.journeys.splice(i, 1);
        this.journeySvc.deleteJourney(id).subscribe(
          (result) => console.log(result),
          (err) => console.log(err)
        );
        this.presentToastSuccess("Journey was deleted");
        this.getJourneys();
        this.showSearchbar = false;
      }
    }
  }

  public editJourney(id: String, title: String, dateS: Date, dateE: Date, item: ItemSliding) {
    item.close();
    let data = {
      id_journey: id,
      title_journey: title,
      date_start: dateS,
      date_end: dateE
    };
    let modal = this.modalCtrl.create(EditJourneyPage, data); 
    modal.present();
  }

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

  private presentToastSuccess(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 1500,
      position: "bottom",
      cssClass: "success"
    });
    toast.present();
  }

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
}