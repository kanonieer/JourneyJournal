import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';


@Injectable()

export class IsUserLoggedIn implements CanActivate {

    constructor( private router: Router ) {
    }

    canActivate() {
        if (!!localStorage.getItem('user_id')) {
            return !!localStorage.getItem('user_id');
        } else {
            this.router.navigateByUrl('login');
        }
    }
}
