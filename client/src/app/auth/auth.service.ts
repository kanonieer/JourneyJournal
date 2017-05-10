import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { apiAdress } from './../shared/globalVariables';
import { handleError } from './../shared/handleError';

@Injectable()
export class AuthService {

  constructor(private _http: Http) { }

  private headers = new Headers({'Content-Type':'application/json'});
  private options = new RequestOptions({headers: this.headers});

  authFacebook(): Observable<any>{
    return this._http.get(apiAdress+'/auth/facebook', this.options)
      .map((response: Response) => response.json())
      .catch(handleError);
  }

  getMe(payload: any): Observable<any>{
    return this._http.post(apiAdress+'/profile', JSON.stringify(payload), this.options)
      .map((response: Response) => response.json())
      .catch(handleError);
  }

  signUpBasic(payload: any): Observable<any>{
    return this._http.post(apiAdress+'/signup', JSON.stringify(payload), this.options)
      .map((response: Response) => response.json())
      .catch(handleError);
  }

  loginBasic(payload: any): Observable<any>{
    return this._http.post(apiAdress+'/login', JSON.stringify(payload), this.options)
      .map((response: Response) => response.json())
      .catch(handleError);
  }

}