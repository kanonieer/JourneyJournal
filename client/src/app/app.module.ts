import { BrowserModule } from '@angular/platform-browser';
import { NgModule }      from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { routing }       from './app.routing';

//my modules
import { AboutModule }   from './about/about.module';
import { JourneysModule} from './journeys/journeys.module';
import { ProfileModule}  from './profile/profile.module';
import { SummaryModule}  from './summary/summary.module';
import { HomeModule }    from './home/home.module';
import { AuthModule }    from './auth/auth.module';

//components
import { AppComponent }  from './app.component';

import { IsUserLoggedIn } from './shared/isUserLoggedIn';
import { ExploreJourneyComponent } from './explore-journey/explore-journey.component';
import { DropboxService } from './services/dropbox.service';

@NgModule({
  declarations: [
    AppComponent,
    ExploreJourneyComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    AboutModule,
    JourneysModule,
    ProfileModule,
    SummaryModule,
    HomeModule,
    AuthModule
  ],
  providers: [
    IsUserLoggedIn,
    DropboxService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
