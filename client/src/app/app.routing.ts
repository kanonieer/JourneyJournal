import {Router, RouterModule }  from '@angular/router';

import { HomeComponent }        from './home/home.component';
import { JourneysComponent }    from './journeys/journeys.component';
import { SummaryComponent }     from './summary/summary.component';
import { ProfileComponent }     from './profile/profile.component';
import { AboutComponent }       from './about/about.component';
import { AuthComponent }        from './auth/auth.component';
import { FacebookComponent }    from './auth/facebook/facebook.component';
import { SignUpLoginComponent } from './auth/sign-up-login/sign-up-login.component';

import { IsUserLoggedIn } from './shared/isUserLoggedIn';

export const routing = RouterModule.forRoot([
    { path: '', component: HomeComponent, pathMatch: 'full', canActivate: [IsUserLoggedIn]},
    { path: 'journeys', component: JourneysComponent, canActivate: [IsUserLoggedIn] },
    { path: 'summary', component: SummaryComponent, canActivate: [IsUserLoggedIn] },
    { path: 'profile', component: ProfileComponent, canActivate: [IsUserLoggedIn] },
    { path: 'about', component: AboutComponent, canActivate: [IsUserLoggedIn] },

    { path: 'login', component: AuthComponent, children:  [
      { path: '', redirectTo: 'form', pathMatch: 'full' },
      { path: 'form', component: SignUpLoginComponent },
      { path: 'facebook', component: FacebookComponent }
    ] }

]);
