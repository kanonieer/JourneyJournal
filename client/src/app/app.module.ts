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

@NgModule({
  declarations: [
    AppComponent
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
  providers: [IsUserLoggedIn],
  bootstrap: [AppComponent]
})
export class AppModule { }
