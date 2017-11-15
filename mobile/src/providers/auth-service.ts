import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// Shared
import { serverAdress } from './../shared/globalVariables';
import { handleError } from './../shared/errorHandler';

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

  private headers = new Headers({'Content-Type': 'application/json'});
  private options = new RequestOptions({headers: this.headers});

  signUpBasic(payload: any): Observable<any> {
    return this._http.post(serverAdress + '/signup', JSON.stringify(payload), this.options)
      .map((response: Response) => response.json())
      .catch(handleError);
  }
  
  loginBasic(payload: any): Observable<any> {
    return this._http.post(serverAdress + '/login', JSON.stringify(payload), this.options)
      .map((response: Response) => response.json())
      .catch(handleError);
  }

  signUpFacebook(payload: any): Observable<any> {
    return this._http.post(serverAdress + '/facebookAuthorization', JSON.stringify(payload), this.options)
      .map((response: Response) => response.json())
      .catch(handleError);
  }

  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }
}
