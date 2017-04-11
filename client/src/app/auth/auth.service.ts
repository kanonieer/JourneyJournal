import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { apiAdress } from './../shared/globalVariables';

@Injectable()
export class AuthService {

  constructor(private _http: Http) { }

  private headers = new Headers({'Content-Type':'application/json'});
  private options = new RequestOptions({headers: this.headers});

  authFacebook(): Observable<any>{
    return this._http.get(apiAdress+'/auth/facebook', this.options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  signUpBasic(payload: any): Observable<any>{
    return this._http.post(apiAdress+'/signup',JSON.stringify(payload), this.options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  loginBasic(payload: any): Observable<any>{
    return this._http.post(apiAdress+'/login',JSON.stringify(payload), this.options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  private handleError(error: Response) {
            if (error.status === 401) {
                return Observable.throw('Unauthorized');
            }
            if (error.status === 500) {
                return Observable.throw('Server down');
            }else{
                return Observable.throw(error.json().error || 'Server error');             
            }
  }
}
