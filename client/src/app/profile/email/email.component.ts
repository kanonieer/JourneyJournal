import { Component, OnInit }  from '@angular/core';
import { NgForm }             from '@angular/forms';
import { AccountService }     from './../account.service';
import { Router }             from '@angular/router';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.less']
})
export class EmailComponent implements OnInit {

  constructor(private accountService: AccountService, private router: Router) { }

  ngOnInit() {
  }

  changeEmail(form: NgForm){
    this.accountService.changeEmail(form.value).subscribe(
      data => {
        alert('Email zmieniony!');
        this.router.navigateByUrl('');
      },
      error => {
        if (error.code == undefined) {
          alert('Brak uprawnień');
        }
        if (error.code == 401.1) {
          alert('Nie dodałeś jeszcze opcji logowania przez email');
        }
        if (error.code == 401.2) {
          alert('Stary email jest nie prawidłowy');
        }
        if (error.code == 401.3) {
          alert('Email jest już zajęty');
        }                
      }
    );
  }
}