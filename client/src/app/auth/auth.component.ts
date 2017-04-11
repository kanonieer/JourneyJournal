import { Component, OnInit } from '@angular/core';
import { NgForm }            from '@angular/forms';
import { AuthService }       from './auth.service';
import { Router }            from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.less']
})
export class AuthComponent implements OnInit {

  private formToggle: Boolean;

  constructor(private authService: AuthService, private router: Router) { 
    this.formToggle = true;
  }

  loginUser(form: NgForm) {
    let payload = {
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
        if(err === 'Unauthorized'){
          alert('Błędne dane logowania!');
        }
      }
    );
  }

  signUpUser(form: NgForm) {
    let payload = {
      email: form.value.email,
      password: form.value.password
    };
    this.authService.signUpBasic(payload).subscribe(
      data => {
        console.log(data)
        alert('Zostałeś zarejestrowany, możesz się zalogować!');
        this.router.navigateByUrl('login');
      },
      err => {
        console.log(err);
      }
    );
  }
  
  toggleForm(toogle: String){
    if(toogle=='login'){
      this.formToggle = true;
    }
    if(toogle=='signup'){
      this.formToggle = false;
    }

  }

  ngOnInit() {
  }

}
