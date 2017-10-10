import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from './../shared/services/auth.service';
import { StorageService } from './../shared/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private storageService: StorageService
  ) { }

  ngOnInit() {
  }

  public login(loginForm: NgForm): void {
    const payload = loginForm.form.value;

    this.authService
    .signIn(payload)
    .subscribe((response) => this.storeUser(response));
  }

  private storeUser(response): void {
    const { token, user: { _id, dropbox: { access_token } } } = response;

    this.storageService.set('token', token);
    this.storageService.set('user_id', _id);
    this.storageService.set('dropbox_token', access_token);
  }
}
