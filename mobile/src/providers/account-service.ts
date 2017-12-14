import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { catchError } from 'rxjs/operators/catchError';

// Shared
import { serverAdress } from './../shared/GlobalVariables';
import { successHandle, errorHandle, errorHandleBody } from './../shared/Handler';

// Providers
import { StorageService } from './storage-service';

@Injectable()
export class AccountService {

  constructor(private _http: Http, private storageSvc: StorageService) {
    
  }

  public headers = new Headers({'Content-Type': 'application/json'});
  public options = new RequestOptions({headers: this.headers});
  public user_id = this.storageSvc.get('user_id');
  public access_token = this.storageSvc.get('token');

  public getMe(payload: any): Observable<any> {
    return this._http.post(serverAdress + '/profile', JSON.stringify(payload), this.options).pipe(
      map(successHandle),
      catchError(errorHandle)
    );
  }

  public changeEmail(form: any): Observable<any> {
    let payload = {
      form: form,
      access_token: this.access_token
    };
    return this._http.patch(serverAdress + '/users/' + this.user_id + '/email', JSON.stringify(payload), this.options).pipe(
      map(successHandle),
      catchError(errorHandleBody)
    );
  }

  public changePassword(form: any): Observable<any> {
    let payload = {
      form: form,
      access_token: this.access_token
    };
    return this._http.patch(serverAdress + '/users/' + this.user_id + '/password', JSON.stringify(payload), this.options).pipe(
      map(successHandle),
      catchError(errorHandleBody)
    );
  }

  public deleteAccount(): Observable<any> {
    return this._http.delete(serverAdress + '/users/' + this.user_id + '?access_token=' + this.access_token, this.options).pipe(
      map(successHandle),
      catchError(errorHandle)
    );
  }
}