import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ItemSliding, ToastController, MenuController } from 'ionic-angular';

import { AddJourneyPage } from '../addJourney/addJourney';
import { DetailsJourneyPage} from '../detailsJourney/detailsJourney';
import { AboutPage } from '../about/about';
import { MapsPage } from '../maps/maps';

import { JourneyService } from '../../providers/journey-service';

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
  aboutPage = AboutPage;
  mapsPage = MapsPage;

  public journeys: Array<Journey>;
  public loadedJourneys: Array<Journey>;
  public showSearchbar: boolean = false;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public toastCtrl: ToastController, public menuCtrl: MenuController, private journeySvc: JourneyService) {
    this.getJourneys();
  }

  toggleSearchbar() {
    this.showSearchbar = !this.showSearchbar;
  }

  ngOnInit() {
  }

  public getJourneys() {
    this.journeySvc.getJourneys().subscribe((
      data:Array<Journey>) => {
        this.journeys = data;
        this.loadedJourneys = data;
      }, 
      err => console.log(err)
    );
  }

  // Needed for search bar
  initializeItems(): void {
    this.journeys = this.loadedJourneys;
  }

  public detailsJourney(id: string, title: string) {
    this.navCtrl.push(DetailsJourneyPage, {
      id_travel: id,
      title_travel: title
    });
  }

  public deleteJourney(id: string) {

    // 'for' loop through the list, and delete selected item
    for(let i = 0; i < this.journeys.length; i++) {
      if(this.journeys[i]._id == id) {
        this.journeys.splice(i, 1);
        this.journeySvc.deleteJourney(id).subscribe(
          result => console.log(result),
          err => console.log(err)
        );
        this.presentToastSuccess("Journey was deleted");
        this.getJourneys();
        this.showSearchbar = false;
      }
    }
  }

  public editJourney(id, item: ItemSliding) {

    alert(id);
    item.close();

  }

  public deleteConfirm(id, item: ItemSliding) {

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
      duration: 2000,
      position: "bottom",
      cssClass: "success"
    });
    toast.present();
  }

  getItems(searchbar) {
    this.initializeItems();
    let typedValue = searchbar.srcElement.value;

    // trim => remove whitespace from both sides of a string
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