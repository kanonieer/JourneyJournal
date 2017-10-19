import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { StorageService } from './../services/storage.service';

@Injectable()
export class IsLogged implements CanActivate {

    constructor(
        private router: Router,
        private storageService: StorageService
    ) {}

    canActivate() {
        if (!!this.storageService.get('user_id')) {
            return !!this.storageService.get('user_id');
        } else {
            this.router.navigateByUrl('login');
        }
    }
}