import { RouterModule, Router } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GalleryComponent } from './gallery/gallery.component';
import { AboutComponent } from './about/about.component';
import { JourneysComponent } from './journeys/journeys.component';
import { LoginComponent } from './login/login.component';
import { IsLogged } from './shared/global/isLogged';

export const routing = RouterModule.forRoot([
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'gallery', component: GalleryComponent, canActivate: [IsLogged] },
    { path: 'journeys', component: JourneysComponent, canActivate: [IsLogged] },
    { path: 'about', component: AboutComponent, canActivate: [IsLogged] }
]);