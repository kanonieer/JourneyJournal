import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AuthService } from './../auth.service';

@Component({
  selector: 'app-facebook',
  templateUrl: './facebook.component.html',
  styleUrls: ['./facebook.component.less']
})
export class FacebookComponent implements OnInit {

  constructor(
   private activatedRoute: ActivatedRoute,
   private authService: AuthService,
   private router: Router
   ) { }

  ngOnInit() {
    let payload = {
      access_token: ''
    }
    this.activatedRoute.queryParams.subscribe((params: Params) => {
        localStorage.setItem('tempToken', params['token']);
        payload.access_token = params['token'];
      });

    this.authService.getMe(payload).subscribe(
      data => {
        localStorage.setItem('user_id', data._id.toString());
        localStorage.setItem('token', localStorage.getItem('tempToken'));
        localStorage.removeItem('tempToken');
        localStorage.setItem('user_logged', 'true');

        this.router.navigateByUrl('');
      },
      err => {
        if(err === 'Unauthorized'){
          alert('Błędne dane logowania!');
        }
      }
    )
  }

}
