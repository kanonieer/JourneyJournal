import { Component } from '@angular/core';

// Providers
import { StorageService } from '../../providers/storage-service';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})

export class SettingsPage {

  isChecked: boolean = false;
  saveToggle: string = this.storageSvc.get('save_images');;

  constructor(private storageSvc: StorageService) {
    this.checked();
  }

  saveImages() {
    if(this.saveToggle === 'true') {
      this.storageSvc.set('save_images', 'false');
    } else {
      this.storageSvc.set('save_images', 'true');
    }
  }

  checked() {
    return this.isChecked = this.saveToggle === 'true' ? true : false;  
  }
}
