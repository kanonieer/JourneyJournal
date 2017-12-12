import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// Shared
import { serverAdress } from './../shared/globalVariables';
import { successHandle, errorHandle } from './../shared/Handler';

export class User {
  email: string;

  constructor(email: string) {
    this.email = email;
  }
}

@Injectable()

export class AuthService {

  currentUser: User;

  constructor(private _http: Http) {

  }

  public headers = new Headers({'Content-Type': 'application/json'});
  public options = new RequestOptions({headers: this.headers});

  public signUpBasic(payload: any): Observable<any> {
    return this._http.post(serverAdress + '/signup', JSON.stringify(payload), this.options)
      .map(successHandle)
      .catch(errorHandle);
  }
  
  public loginBasic(payload: any): Observable<any> {
    return this._http.post(serverAdress + '/login', JSON.stringify(payload), this.options)
      .map(successHandle)
      .catch(errorHandle);
  }

  public signUpFacebook(payload: any): Observable<any> {
    return this._http.post(serverAdress + '/facebookAuthorization', JSON.stringify(payload), this.options)
      .map(successHandle)
      .catch(errorHandle);
  }

  public logout() {
    return Observable.create((observer) => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }
}
