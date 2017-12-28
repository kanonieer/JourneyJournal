import { Component, ViewChild } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NavController, AlertController, MenuController, ModalController, Events, ItemSliding, Searchbar } from 'ionic-angular';

// Plugins
import { Keyboard } from '@ionic-native/keyboard';

// Providers
import { JourneyService } from '../../providers/journey-service';
import { uiComp } from '../../providers/ui-components';

// Shared
import { navOptionsForward } from '../../shared/GlobalVariables';

// Models
import { Journey } from './../../models/Journey';

@IonicPage()
@Component({
  selector: 'page-journeys',
  templateUrl: 'journeys.html',
  providers: [JourneyService, uiComp]
})

export class JourneysPage {

  @ViewChild('search') searchInput: Searchbar;

  ionViewDidLoad() {
    this.menuCtrl.enable(true);
    this.getJourneys();
  }

  public journeys: Array<Journey>;
  public loadedJourneys: Array<Journey>;
  public showSearchbar: boolean = false;
  public searchQuery = '';

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public menuCtrl: MenuController, public modalCtrl: ModalController,
    public events: Events, public keyboard: Keyboard, private journeySvc: JourneyService, private uiCmp: uiComp) {

    events.subscribe('journeys:get', () => {
      this.getJourneys();
    });

    events.subscribe('journeys:reload', (journeys) => {
      this.loadedJourneys = journeys;
      this.initializeItems();
    });
  }

  // JOURNEYS //
  // Add
  public addJourney() {
    this.navCtrl.push('AddJourneyPage', {journeys: this.loadedJourneys}, navOptionsForward);
    this.toggleSearchbarOff();
  }

  // Edit
  public editJourney(id: String, title: String, item: ItemSliding) {
    let data = {
      id_journey: id,
      title_journey: title
    };
    let modal = this.modalCtrl.create('EditJourneyPage', data); 
    modal.present();
    item.close();
    this.toggleSearchbarOff();
  }

  // Details
  public detailsJourney(id: String, title: String) {
    this.navCtrl.push('DetailsJourneyPage', {
      id_journey: id,
      title_journey: title
    }, navOptionsForward);
    this.toggleSearchbarOff();
  }

  // Get all
  public getJourneys() {
    this.journeySvc.getJourneys().subscribe(
      (data: Array<Journey>) => {
        this.loadedJourneys = data;
        this.initializeItems();
      }, 
      (error) => {
        this.uiCmp.presentToastError(error);
      }
    );
  }

  // Needed for search bar
  public initializeItems(): void {
    this.journeys = this.loadedJourneys;
  }

  // Confirm
  public deleteConfirm(id: String, title: String, item: ItemSliding) {
    const alert = this.alertCtrl.create({
      title: 'Confirm delete',
      message: 'Do you want to delete \"' + title + '\"?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            item.close();
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
    for(let i = 0; i < this.loadedJourneys.length; i++) {
      if(this.loadedJourneys[i]._id === id) {
        this.journeySvc.deleteJourney(id).subscribe(
          (result) => {
            this.loadedJourneys.splice(i, 1);
            this.toggleSearchbarOff();
            this.initializeItems();
            this.uiCmp.presentToastSuccess(result);
          },
          (error) => {
            this.uiCmp.presentToastError(error);
          }
        );
      }
    }
  }

  // SEARCHBAR //
  // On
  public toggleSearchbarOn() {
    this.showSearchbar = true;
    setTimeout(() => {
      this.searchInput.setFocus();
      this.keyboard.show();
    }, 100);
    this.keyboard.onKeyboardShow().subscribe((data) => {
      this.searchInput.setFocus();
    });
  }

  // Off
  public toggleSearchbarOff() {
    this.showSearchbar = false;
    this.searchQuery = '';
  }

  // Search
  public getItems(searchbar) {
    this.initializeItems();
    let typedValue = searchbar.target.value;
    // trim => remove whitespace from both sides of a String
    if (typedValue && typedValue.trim() !== '') {
      this.journeys = this.journeys.filter((journey) => {
        return (journey.title.toLowerCase().indexOf(typedValue.toLowerCase()) > -1);
      });
    }
  }

  // REFRESHER //
  // Do function
  public doRefresh(refresher) {
    this.toggleSearchbarOff();
    this.getJourneys();

    setTimeout(() => {
      refresher.complete();
    }, 500);
  }
}