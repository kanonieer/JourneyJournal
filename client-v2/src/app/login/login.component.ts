import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './../shared/services/auth.service';
import { StorageService } from './../shared/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  public login(loginForm: NgForm): void {
    const payload = loginForm.form.value;

    this.authService
    .signIn(payload)
    .subscribe((response) => {
      this.storeUser(response);
      this.navigaToHomePage();
    });
  }

  private storeUser(response): void {
    const { token, user: { _id } } = response;

    this.storageService.set('token', token);
    this.storageService.set('user_id', _id);
  }

  private navigaToHomePage(): void {
    this.router.navigateByUrl('');
  }
}
