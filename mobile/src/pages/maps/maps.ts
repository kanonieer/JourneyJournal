import { Component, ViewChild, ElementRef } from '@angular/core';

// Plugins
import { Geolocation } from '@ionic-native/geolocation';

declare var google;

@Component({
  selector: 'page-maps',
  templateUrl: 'maps.html'
})

export class MapsPage {

  @ViewChild('map') mapElement: ElementRef;

  map: any;

  constructor(private geolocation: Geolocation) {

    this.loadMap();
  }

  // MAPS //
  // Load
  loadMap(){

    this.geolocation.getCurrentPosition().then((position) => {

      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    }, (err) => {
      console.log(err);
    });
  }

  // Marker
  addMarker() {
    
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });
    
    let content = "<h4>Information!</h4>";          
    
    this.addInfoWindow(marker, content);
  }

  // Info
  addInfoWindow(marker, content) {
    
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  // GEOLOCATION //
  // Get
  getGeo() {

    this.geolocation.getCurrentPosition().then((resp) => {
      let test = {
        lat: resp.coords.latitude,
        long: resp.coords.longitude
      }
      alert(JSON.stringify(test));
    }).catch((err) => {
      console.log('err', err);
    });
  }
}