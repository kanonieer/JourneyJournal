import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { catchError } from 'rxjs/operators/catchError';

// Providers
import { StorageService } from '../providers/storage-service';

// Shared
import { serverAdress } from './../shared/GlobalVariables';
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

  constructor(private _http: Http, private storageSvc: StorageService) {

  }

  public headers = new Headers({'Content-Type': 'application/json'});
  public options = new RequestOptions({headers: this.headers});

  public signUpBasic(payload: any): Observable<any> {
    return this._http.post(serverAdress + '/signup', JSON.stringify(payload), this.options).pipe(
      map(successHandle),
      catchError(errorHandle)
    );
  }
  
  public loginBasic(payload: any): Observable<any> {
    return this._http.post(serverAdress + '/login', JSON.stringify(payload), this.options).pipe(
      map(successHandle),
      catchError(errorHandle)
    );
  }

  public signUpFacebook(payload: any): Observable<any> {
    return this._http.post(serverAdress + '/facebookAuthorization', JSON.stringify(payload), this.options).pipe(
      map(successHandle),
      catchError(errorHandle)
    );
  }

  public addFacebook(payload: any): Observable<any> {
    const user_id = this.storageSvc.get('user_id');
    const access_token = this.storageSvc.get('token');
    return this._http.patch(serverAdress + '/users/' + user_id + '/addFacebook?access_token=' + access_token, JSON.stringify(payload), this.options).pipe(
      map(successHandle),
      catchError(errorHandle)
    );
  }

  public logout() {
    return Observable.create((observer) => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }
}
