import { Component, OnInit } from '@angular/core';
import { AuthService } from './../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less']
})
export class ProfileComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  authByFacebook(){
    console.log('clicked!');
    this.authService.authFacebook().subscribe(
      data => console.log(data),
      err => console.log(err)
    )
  }

}
