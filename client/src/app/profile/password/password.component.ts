import { Component, OnInit }  from '@angular/core';
import { NgForm }             from '@angular/forms';
import { AccountService }     from './../account.service';
import { LogoutService }      from './../../logout.service';
import { Router }             from '@angular/router';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.less']
})
export class PasswordComponent implements OnInit {

  constructor(
    private accountService: AccountService,
    private router: Router,
    private logoutService: LogoutService
    ) { }

  ngOnInit() {
  }
  changePassword(form: NgForm){
    var payload = {
      oldPassword: form.value.oldPassword,
      newPassword: form.value.newPassword
    };

    this.accountService.changePassword(payload).subscribe(
      data => {
        alert('Hasło zmienione, zaloguj się z nowym hasłem');
        this.logoutService.logout();
      },
      error => {
        console.log(error);
        if (error.code == undefined) {
          alert('Brak uprawnień');
        }
        if (error.code == 401.1) {
          alert('Podałeś niepoprawne hasło');
        }         
      }
    );
  }
}