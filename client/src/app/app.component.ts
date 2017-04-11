import { Component } from '@angular/core';
import { Router }    from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'app works!';

  private isLogged = true;

  constructor(){   
    //this.isLogged = !!localStorage.getItem('user_id');
  }  
}