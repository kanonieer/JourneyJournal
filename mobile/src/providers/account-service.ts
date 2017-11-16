import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// Shared
import { serverAdress } from './../shared/globalVariables';
import { handleError } from './../shared/errorHandler';

// Providers
import { StorageService } from './storage-service';

@Injectable()
export class AccountService {

  constructor(private _http: Http, private storageSvc: StorageService) { }

  private headers = new Headers({'Content-Type': 'application/json'});
  private options = new RequestOptions({headers: this.headers});

  getMe(payload: any): Observable<any> {
    return this._http.post(serverAdress + '/profile', JSON.stringify(payload), this.options)
      .map((response: Response) => response.json())
      .catch(handleError);
  }

  changeEmail(form: any): Observable<any> {
    let payload = {
      form: form,
      access_token: this.storageSvc.get('token')
    };
    console.log(payload);
    
    return this._http.patch(serverAdress + '/email', JSON.stringify(payload), this.options)
      .map((response: Response) => response.json())
      .catch(handleError);
  }

  changePassword(form: any): Observable<any> {
    let payload = {
      form: form,
      access_token: this.storageSvc.get('token')
    };
    return this._http.patch(serverAdress + '/password', JSON.stringify(payload), this.options)
      .map((response: Response) => response.json())
      .catch(handleError);
  }
}