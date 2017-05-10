import { Component, OnInit }  from '@angular/core';
import { LogoutService }      from './../logout.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  constructor(private logoutService: LogoutService) { }

  logout(){
    this.logoutService.logout();
  }

  ngOnInit() {
  }

}
