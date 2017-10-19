import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { AuthService } from './../auth.service';
import { DropboxService } from './../../services/dropbox.service';

@Component({
  selector: 'app-sign-up-login',
  templateUrl: './sign-up-login.component.html',
  styleUrls: ['./sign-up-login.component.less']
})
export class SignUpLoginComponent implements OnInit {

  tab = 1;

  constructor(
    private authService: AuthService,
    private dropboxService: DropboxService,
    private router: Router
  ) {}

  loginUser(form: NgForm): void {
    const payload = {
      email: form.value.email,
      password: form.value.password
    };
    this.authService.loginBasic(payload).subscribe(
      data => {
        localStorage.setItem('user_id', data.user._id.toString());
        localStorage.setItem('token', data.token);
        localStorage.setItem('user_logged', 'true');

        this.router.navigateByUrl('');
      },
      err => {
        if (err === 'Unauthorized') {
          alert('Błędne dane logowania!');
        }
      }
    );
  }

  signUpUser(form: NgForm): void {
    const payload = {
      email: form.value.email,
      password: form.value.password
    };
    this.authService.signUpBasic(payload).subscribe(
      data => {
        console.log(data);
        alert('Zostałeś zarejestrowany, możesz się zalogować!');
        this.router.navigateByUrl('login');
      },
      err => {
        console.log(err);
      }
    );
  }

  public authWithFacebook(): void {
    this.authService.authFacebook().subscribe(
      data => {
        console.log(data);
        localStorage.setItem('user_id', data.user._id.toString());
        localStorage.setItem('token', data.token);
        localStorage.setItem('user_logged', 'true');

        this.router.navigateByUrl('');
      },
      err => {
        if (err === 'Unauthorized') {
          alert('Błędne dane logowania!');
        }
      }
    );
  }

  public authDropbox(): void {
    this.dropboxService.authUser();
  }

  setTab(num: number) {
    this.tab = num;
  }

  isSelected(num: number) {
    return this.tab === num;
  }
  ngOnInit() {
  }

}
