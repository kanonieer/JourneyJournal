import { Component, OnInit } from '@angular/core';
import { Router }    from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less']
})
export class ProfileComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  redirectToDropbox(){
    window.location.href = "http://localhost:8080/auth/dropbox?access_token="+localStorage.getItem('token');
  }
}