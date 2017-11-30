import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// Shared
import { serverAdress } from './../shared/globalVariables';
import { successHandle, errorHandle, errorHandleAccount } from './../shared/Handler';

// Providers
import { StorageService } from './storage-service';

@Injectable()
export class AccountService {

  constructor(private _http: Http, private storageSvc: StorageService) {
    
  }

  private headers = new Headers({'Content-Type': 'application/json'});
  private options = new RequestOptions({headers: this.headers});

  getMe(payload: any): Observable<any> {
    return this._http.post(serverAdress + '/profile', JSON.stringify(payload), this.options)
      .map(successHandle)
      .catch(errorHandle);
  }

  changeEmail(form: any): Observable<any> {
    let payload = {
      form: form,
      access_token: this.storageSvc.get('token')
    };
    return this._http.patch(serverAdress + '/email', JSON.stringify(payload), this.options)
      .map(successHandle)
      .catch(errorHandleAccount);
  }

  changePassword(form: any): Observable<any> {
    let payload = {
      form: form,
      access_token: this.storageSvc.get('token')
    };
    return this._http.patch(serverAdress + '/password', JSON.stringify(payload), this.options)
      .map(successHandle)
      .catch(errorHandleAccount);
  }

  deleteAccount(id: any): Observable<any> {
    const access_token = this.storageSvc.get('token');

    return this._http.delete(serverAdress + '/users/' + id + '?access_token=' + access_token, this.options)
      .map(successHandle)
      .catch(errorHandle);
  }
}