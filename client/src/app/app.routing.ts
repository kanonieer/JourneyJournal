import {Router, RouterModule } from '@angular/router';

import { HomeComponent }     from './home/home.component';
import { JourneysComponent } from './journeys/journeys.component';
import { SummaryComponent }  from './summary/summary.component';
import { ProfileComponent }  from './profile/profile.component';
import { AboutComponent }    from './about/about.component';

export const routing = RouterModule.forRoot([
    { path: '', component: HomeComponent },
    { path: 'journeys', component: JourneysComponent },
    { path: 'summary', component: SummaryComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'about', component: AboutComponent }
]);
