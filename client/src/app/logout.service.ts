import { Injectable }   from '@angular/core';
import { Router }       from '@angular/router';

@Injectable()
export class LogoutService {

    constructor(private router: Router){}
    
    logout(): void {
        localStorage.removeItem('user_id');
        localStorage.removeItem('token');
        localStorage.removeItem('user_logged');

        this.router.navigateByUrl('login');
    }    
}