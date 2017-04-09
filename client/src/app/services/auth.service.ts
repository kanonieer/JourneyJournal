import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { apiAdress } from './../shared/globalVariables';

@Injectable()
export class AuthService {

  constructor(private _http: Http) { }

  private headers = new Headers({'content-Type':'application/json'});
  private options = new RequestOptions({headers: this.headers});

  authFacebook(): Observable<any>{
    return this._http.get(apiAdress+'/auth/facebook', this.options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }
  
  private handleError(error: Response) {
    console.error('Auth Service Error:', error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
