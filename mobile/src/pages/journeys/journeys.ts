import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ItemSliding, ToastController } from 'ionic-angular';
import { Journey } from './../../models/Journey';
import { AuthService } from '../../providers/auth-service';

import { AddJourneyPage } from '../addJourney/addJourney';
import { DetailsJourneyPage} from '../detailsJourney/detailsJourney';
import { AboutPage } from '../about/about';
import { MapsPage } from '../maps/maps';

@Component({
  selector: 'page-journeys',
  templateUrl: 'journeys.html'
})

export class JourneysPage implements OnInit {

  addJourneyPage = AddJourneyPage;
  aboutPage = AboutPage;
  mapsPage = MapsPage;

  public journeys: Array<Journey>;
  public loadedJourneys: Array<Journey>;
  public showSearchbar: boolean = false;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public toastCtrl: ToastController, private journeyService: AuthService) {
    this.getJourneys();
  }


  toggleSearchbar() {
    this.showSearchbar = !this.showSearchbar;
  }

  ngOnInit() {
  }

  public getJourneys() {
    this.journeyService.getJourneys().subscribe((
      data:Array<Journey>) => {
        this.journeys = data;
        this.loadedJourneys = data;
      }, 
      err => console.log(err)
    );
  }

  initializeItems(): void {
    this.journeys = this.loadedJourneys;
  }

  public detailsJourney(id: string) {
    this.navCtrl.push(DetailsJourneyPage, {
      id_travel: id
    });
  }

  public deleteJourney(id) {

    for(let i = 0; i < this.journeys.length; i++) {
      if(this.journeys[i]._id == id) {
        this.journeys.splice(i, 1);
        this.journeyService.deleteJourney(id).subscribe(
          result => console.log(result),
          err => console.log(err)
        );
        this.presentToast("Journey was deleted");
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

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: "bottom"
    });
    toast.present();
  }

  getItems(searchbar) {
    this.initializeItems();
    let q = searchbar.srcElement.value;

    if (q && q.trim() !== '') {
      this.journeys = this.journeys.filter((journey) => {
        if(journey.title && q) {
          if(journey.title.toLowerCase().indexOf(q.toLowerCase()) > -1) {
            return true;
          }
          return false;
        }
      });
    }
  }
}